import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';
import Stepper from '../../components/Stepper';
import { Button, Field } from '../../components/ui';
import { registerInstructor, uploadFile } from '../../lib/api';
import { pickUrl } from '../../lib/api-types';
import { DAY_OPTIONS, GENDER_OPTIONS, SESSION_OPTIONS, useLocationOptions } from '../../lib/reg-options';
import type { ScheduleSlot } from '../../lib/api-types';

const STEPS = ['Profil pelatih', 'Deklarasi jadwal', 'Ringkasan'];

interface Values {
  fullName: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  shortBio: string;
  license: string;
  experience: string;
}

const INITIAL: Values = {
  fullName: '',
  phone: '',
  birthDate: '',
  gender: GENDER_OPTIONS[0],
  address: '',
  shortBio: '',
  license: '',
  experience: '',
};

interface JadwalRow extends ScheduleSlot {
  key: number;
}

const inputClass =
  'mt-1 block w-full font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out focus:outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/40';

let rowKey = 0;
function newRow(): JadwalRow {
  rowKey += 1;
  return { key: rowKey, locationId: '', dayOfWeek: DAY_OPTIONS[0]?.id ?? 'Senin', sessionName: SESSION_OPTIONS[0]?.id ?? 'Sesi 1' };
}

export default function FormPelatih() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>(INITIAL);
  const [err, setErr] = useState<Record<string, string>>({});
  const [schedules, setSchedules] = useState<JadwalRow[]>([newRow()]);
  const [foto, setFoto] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const locations = useLocationOptions();

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    setErr((prev) => ({ ...prev, [key]: '' }));
  }

  function onFile(e: ChangeEvent<HTMLInputElement>, apply: (f: File | null) => void, accept: 'pdf' | 'image') {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 5 MB.', { style: { color: '#B3341F' } });
      e.target.value = '';
      apply(null);
      return;
    }
    if (f && accept === 'pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      toast.error('CV harus berupa file PDF.', { style: { color: '#B3341F' } });
      e.target.value = '';
      apply(null);
      return;
    }
    apply(f);
  }

  async function next() {
    if (step === 0) {
      const e: Record<string, string> = {};
      if (!v.fullName.trim()) e.fullName = 'Nama lengkap wajib diisi.';
      if (!/^[0-9+ ]{8,15}$/.test(v.phone.trim())) e.phone = '8-15 digit angka.';
      if (!v.birthDate) e.birthDate = 'Tanggal lahir wajib diisi.';
      if (!v.address.trim()) e.address = 'Alamat wajib diisi.';
      if (!v.shortBio.trim()) e.shortBio = 'Bio singkat wajib diisi.';
      if (!v.license.trim()) e.license = 'Lisensi wajib diisi.';
      if (!v.experience.trim()) e.experience = 'Pengalaman wajib diisi.';
      if (!foto) toast.error('Foto wajib diunggah.', { style: { color: '#B3341F' } });
      if (!cv) toast.error('CV (PDF) wajib diunggah.', { style: { color: '#B3341F' } });
      setErr(e);
      if (Object.keys(e).length > 0 || !foto || !cv) return;
      setBusy(true);
      try {
        const fd = new FormData();
        fd.append('cv', cv);
        fd.append('profilePicture', foto);
        const cc = await uploadFile('/upload-file/instructor', fd);
        setFotoUrl(pickUrl(cc, ['profilePictureUrl', 'photoUrl']) ?? '');
        setCvUrl(pickUrl(cc, ['cvUrl', 'cv']) ?? '');
      } catch (ex) {
        const msg = ex instanceof Error ? ex.message : 'Gagal mengunggah berkas.';
        toast.error(msg, { style: { color: '#B3341F' } });
      } finally {
        setBusy(false);
      }
      setStep(1);
      return;
    }
    if (schedules.length === 0) {
      toast.error('Tambahkan minimal satu jadwal.', { style: { color: '#B3341F' } });
      return;
    }
    if (schedules.some((s) => !s.locationId)) {
      toast.error('Lengkapi kolam pada setiap baris jadwal.', { style: { color: '#B3341F' } });
      return;
    }
    setStep(2);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await registerInstructor({
        ...v,
        schedules: schedules.map(({ locationId, dayOfWeek, sessionName }) => ({ locationId, dayOfWeek, sessionName })),
        profilePictureUrl: fotoUrl || undefined,
        cvUrl: cvUrl || undefined,
      });
      toast.success('Pendaftaran pelatih berhasil dikirim. Menunggu verifikasi admin.');
      setV(INITIAL);
      setSchedules([newRow()]);
      setFoto(null);
      setCv(null);
      setFotoUrl('');
      setCvUrl('');
      setStep(0);
    } catch (ex) {
      const message = ex instanceof Error ? ex.message : 'Pendaftaran gagal.';
      const status = (ex as { status?: number }).status;
      toast.error(message, {
        style: { color: '#B3341F' },
        description:
          status === 403
            ? 'Backend belum menerima role ADMIN/POOL_MANAGER untuk endpoint register.'
            : undefined,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Stepper steps={STEPS} step={step} />
      {step === 0 ? (
        <form className="rounded-lg border border-gray-200 bg-white p-4" onSubmit={(e) => { e.preventDefault(); void next(); }}>
          <div className="grid gap-x-4 [grid-template-columns:1fr] min-[640px]:[grid-template-columns:1fr_1fr]">
            <Field id="p-name" label="Nama lengkap" name="fullName" value={v.fullName} error={err.fullName} onChange={(e) => set('fullName', e.target.value)} required />
            <Field id="p-phone" label="Nomor telepon" name="phone" type="tel" pattern="[0-9+ ]{8,15}" title="8-15 digit" value={v.phone} error={err.phone} onChange={(e) => set('phone', e.target.value)} required />
            <Field id="p-birth" label="Tanggal lahir" name="birthDate" type="date" value={v.birthDate} error={err.birthDate} onChange={(e) => set('birthDate', e.target.value)} required />
            <label className="block font-semibold mb-3">
              Jenis kelamin
              <select name="gender" value={v.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <Field id="p-addr" label="Alamat" name="address" value={v.address} error={err.address} onChange={(e) => set('address', e.target.value)} required />
            <Field id="p-license" label="Lisensi" name="license" value={v.license} error={err.license} onChange={(e) => set('license', e.target.value)} placeholder="Contoh: Lisensi C FINA" required />
            <Field id="p-exp" label="Pengalaman" name="experience" value={v.experience} error={err.experience} onChange={(e) => set('experience', e.target.value)} placeholder="Contoh: 5 Tahun" required />
            <label className="block font-semibold mb-3">
              CV (PDF, maks 5 MB)
              <input name="cv" type="file" accept="application/pdf" onChange={(e) => onFile(e, setCv, 'pdf')} className={inputClass} />
              {cv ? <span className="mt-1 block text-[13px] text-slate-500">{cv.name}</span> : null}
            </label>
            <label className="block font-semibold mb-3">
              Foto profil (maks 5 MB)
              <input name="foto" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e, setFoto, 'image')} className={inputClass} />
              {foto ? <span className="mt-1 block text-[13px] text-slate-500">{foto.name}</span> : null}
            </label>
          </div>
          <label className="block font-semibold mb-3">
            Bio singkat
            <textarea
              name="shortBio"
              rows={3}
              value={v.shortBio}
              onChange={(e) => set('shortBio', e.target.value)}
              placeholder="Deskripsi singkat latar belakang instruktur"
              className={inputClass}
            />
            {err.shortBio ? <span className="mt-1 block text-[13px] font-medium text-[#B3341F]">{err.shortBio}</span> : null}
          </label>
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>{busy ? 'Mengunggah…' : 'Lanjut'}</Button>
          </div>
        </form>
      ) : step === 1 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-3 text-slate-500">Tambahkan hari dan sesi yang bisa dipelatih di tiap kolam.</p>
          {schedules.map((s, i) => (
            <div key={s.key} className="mb-2.5 grid items-end gap-2 [grid-template-columns:1fr] min-[720px]:[grid-template-columns:auto_1fr_1fr_1fr_auto]">
              <span className="min-[720px]:h-[44px] min-[720px]:leading-[44px] text-slate-500">#{i + 1}</span>
              <label className="block font-semibold">
                <span className="sr-only">Kolam</span>
                <select
                  value={s.locationId}
                  onChange={(e) => setSchedules((prev) => prev.map((r) => (r.key === s.key ? { ...r, locationId: e.target.value } : r)))}
                  aria-label={`Kolam jadwal ${i + 1}`}
                  className={inputClass}
                >
                  <option value="">Pilih kolam…</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </label>
              <label className="block font-semibold">
                <span className="sr-only">Hari</span>
                <select
                  value={s.dayOfWeek}
                  onChange={(e) => setSchedules((prev) => prev.map((r) => (r.key === s.key ? { ...r, dayOfWeek: e.target.value } : r)))}
                  aria-label={`Hari jadwal ${i + 1}`}
                  className={inputClass}
                >
                  {DAY_OPTIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </label>
              <label className="block font-semibold">
                <span className="sr-only">Sesi</span>
                <select
                  value={s.sessionName}
                  onChange={(e) => setSchedules((prev) => prev.map((r) => (r.key === s.key ? { ...r, sessionName: e.target.value } : r)))}
                  aria-label={`Sesi jadwal ${i + 1}`}
                  className={inputClass}
                >
                  {SESSION_OPTIONS.map((ss) => <option key={ss.id} value={ss.id}>{ss.label}</option>)}
                </select>
              </label>
              <Button
                variant="danger"
                aria-label={`Hapus jadwal ${i + 1}`}
                onClick={() => setSchedules((prev) => prev.filter((r) => r.key !== s.key))}
              >
                Hapus
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            className="mb-3"
            onClick={() => setSchedules((prev) => [...prev, newRow()])}
          >
            + Tambah jadwal
          </Button>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>Kembali</Button>
            <Button onClick={() => void next()}>Lanjut</Button>
          </div>
        </div>
      ) : (
        <form className="rounded-lg border border-gray-200 bg-white p-4" onSubmit={submit}>
          <dl className="grid gap-x-6 [grid-template-columns:1fr] min-[640px]:[grid-template-columns:160px_1fr]">
            {[
              ['Nama lengkap', v.fullName],
              ['Telepon', v.phone],
              ['Tanggal lahir', v.birthDate],
              ['Jenis kelamin', v.gender],
              ['Alamat', v.address],
              ['Lisensi', v.license],
              ['Pengalaman', v.experience],
              ['Bio', v.shortBio],
              ['Jumlah jadwal', `${schedules.length} jadwal`],
              ['CV', cv ? cv.name : '—'],
              ['Foto', foto ? foto.name : '—'],
            ].map(([k, val]) => (
              <div key={k} className="border-b border-gray-200 py-2 last:border-0">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-semibold">{val}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Kembali</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim pendaftaran'}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
