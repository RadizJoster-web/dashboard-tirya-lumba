import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';
import Stepper from '../../components/Stepper';
import { Button, Field } from '../../components/ui';
import { registerStudent, uploadFile } from '../../lib/api';
import { pickUrl } from '../../lib/api-types';
import type { UploadOutcome } from '../../lib/api-types';
import { GENDER_OPTIONS, PAYMENT_OPTIONS, TSHIRT_OPTIONS, useInstructorOptions, useLocationOptions, usePackageOptions } from '../../lib/reg-options';

const STEPS = ['Data diri', 'Pilihan kelas', 'Ringkasan'];

interface Values {
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  schoolOrOffice: string;
  tshirtSize: string;
  locationId: string;
  packageId: string;
  firstMeetDate: string;
  firstMeetSession: string;
  instructorId: string;
  paymentMethod: string;
}

const INITIAL: Values = {
  fullName: '',
  birthPlace: '',
  birthDate: '',
  gender: GENDER_OPTIONS[0],
  address: '',
  phone: '',
  email: '',
  schoolOrOffice: '',
  tshirtSize: 'M',
  locationId: '',
  packageId: '',
  firstMeetDate: '',
  firstMeetSession: 'Sesi 1',
  instructorId: '',
  paymentMethod: PAYMENT_OPTIONS[0],
};

const inputClass =
  'mt-1 block w-full font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out focus:outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/40';
const selectClass = inputClass;

function validate(diri: Values): Record<string, string> {
  const err: Record<string, string> = {};
  if (!diri.fullName.trim()) err.fullName = 'Nama lengkap wajib diisi.';
  if (!diri.birthPlace.trim()) err.birthPlace = 'Tempat lahir wajib diisi.';
  if (!diri.birthDate) err.birthDate = 'Tanggal lahir wajib diisi.';
  if (!diri.address.trim()) err.address = 'Alamat wajib diisi.';
  if (!/^[0-9+ ]{8,15}$/.test(diri.phone.trim())) err.phone = '8-15 digit angka.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(diri.email.trim())) err.email = 'Format email tidak valid.';
  if (!diri.schoolOrOffice.trim()) err.schoolOrOffice = 'Sekolah atau kantor wajib diisi.';
  return err;
}

export default function FormMurid() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>(INITIAL);
  const [err, setErr] = useState<Record<string, string>>({});
  const [foto, setFoto] = useState<File | null>(null);
  const [bukti, setBukti] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const [buktiUrl, setBuktiUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const locations = useLocationOptions();
  const instructors = useInstructorOptions();
  const packages = usePackageOptions();
  const paketForLokasi = packages.filter((p) => p.locationId === v.locationId);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    setErr((prev) => ({ ...prev, [key]: '' }));
  }

  function onFile(e: ChangeEvent<HTMLInputElement>, apply: (f: File | null) => void) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 5 MB.', { style: { color: '#B3341F' } });
      e.target.value = '';
      apply(null);
      return;
    }
    apply(f);
  }

  async function next() {
    if (step === 0) {
      const e = validate(v);
      setErr(e);
      if (Object.keys(e).length > 0) return;
      setBusy(true);
      try {
        if (foto) {
          const fd = new FormData();
          fd.append('profilePicture', foto);
          const cc: UploadOutcome = await uploadFile('/upload-file/student/profil', fd);
          setFotoUrl(pickUrl(cc, ['profilePictureUrl']) ?? '');
        }
        if (bukti) {
          const fd = new FormData();
          fd.append('profilePicture', bukti);
          const cc: UploadOutcome = await uploadFile('/upload-file/student/payment', fd);
          setBuktiUrl(pickUrl(cc, ['paymentProofUrl', 'profilePictureUrl']) ?? '');
        }
      } catch (ex) {
        // upload gagal tidak memblokir — biarkan admin mengawasi berkas; URL kosong akan dikosongkan
        const msg = ex instanceof Error ? ex.message : 'Gagal mengunggah berkas.';
        toast.error(msg, { style: { color: '#B3341F' } });
      } finally {
        setBusy(false);
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!v.locationId) { toast.error('Pilih kolam terlebih dulu.', { style: { color: '#B3341F' } }); return; }
      if (!paketForLokasi.length) { toast.error('Belum ada paket untuk kolam ini.', { style: { color: '#B3341F' } }); return; }
      if (!v.packageId) { toast.error('Pilih paket.', { style: { color: '#B3341F' } }); return; }
      if (!v.firstMeetDate) { toast.error('Tanggal pertemuan pertama wajib diisi.', { style: { color: '#B3341F' } }); return; }
      if (!v.instructorId) { toast.error('Pilih pelatih.', { style: { color: '#B3341F' } }); return; }
      setStep(2);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await registerStudent({
        ...v,
        profilePictureUrl: fotoUrl || undefined,
        paymentProofUrl: buktiUrl || undefined,
      });
      toast.success('Pendaftaran murid berhasil dikirim. Menunggu verifikasi admin.');
      setV(INITIAL);
      setFoto(null);
      setBukti(null);
      setFotoUrl('');
      setBuktiUrl('');
      setStep(0);
    } catch (ex) {
      const message = ex instanceof Error ? ex.message : 'Pendaftaran gagal.';
      toast.error(message, {
        style: { color: '#B3341F' },
        description:
          ex instanceof Error && 'status' in ex && (ex as { status?: number }).status === 403
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
            <Field id="m-name" label="Nama lengkap" name="fullName" value={v.fullName} error={err.fullName} onChange={(e) => set('fullName', e.target.value)} required />
            <Field id="m-ttl" label="Tempat lahir" name="birthPlace" value={v.birthPlace} error={err.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} required />
            <Field id="m-birth" label="Tanggal lahir" name="birthDate" type="date" value={v.birthDate} error={err.birthDate} onChange={(e) => set('birthDate', e.target.value)} required />
            <label className="block font-semibold mb-3">
              Jenis kelamin
              <select name="gender" value={v.gender} onChange={(e) => set('gender', e.target.value)} className={selectClass}>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <Field id="m-addr" label="Alamat" name="address" value={v.address} error={err.address} onChange={(e) => set('address', e.target.value)} required />
            <Field id="m-phone" label="Nomor telepon" name="phone" type="tel" pattern="[0-9+ ]{8,15}" title="8-15 digit" value={v.phone} error={err.phone} onChange={(e) => set('phone', e.target.value)} required />
            <Field id="m-email" label="Email" name="email" type="email" value={v.email} error={err.email} onChange={(e) => set('email', e.target.value)} required />
            <Field id="m-school" label="Sekolah / kantor" name="schoolOrOffice" value={v.schoolOrOffice} error={err.schoolOrOffice} onChange={(e) => set('schoolOrOffice', e.target.value)} required />
            <label className="block font-semibold mb-3">
              Ukuran kaos
              <select name="tshirtSize" value={v.tshirtSize} onChange={(e) => set('tshirtSize', e.target.value)} className={selectClass}>
                {TSHIRT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block font-semibold mb-3">
              Foto profil (opsional, maks 5 MB)
              <input name="foto" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e, setFoto)} className={inputClass} />
              {foto ? <span className="mt-1 block text-[13px] text-slate-500">{foto.name}</span> : null}
            </label>
            <label className="block font-semibold mb-3">
              Bukti pembayaran
              <input name="bukti" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e, setBukti)} className={inputClass} />
              {bukti ? <span className="mt-1 block text-[13px] text-slate-500">{bukti.name}</span> : null}
            </label>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>{busy ? 'Mengunggah…' : 'Lanjut'}</Button>
          </div>
        </form>
      ) : step === 1 ? (
        <form className="rounded-lg border border-gray-200 bg-white p-4" onSubmit={(e) => { e.preventDefault(); void next(); }}>
          <label className="block font-semibold mb-3">
            Kolam
            <select name="locationId" value={v.locationId} onChange={(e) => { set('locationId', e.target.value); set('packageId', ''); }} className={selectClass}>
              <option value="">Pilih kolam…</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </label>
          <label className="block font-semibold mb-3">
            Paket
            <select name="packageId" value={v.packageId} onChange={(e) => set('packageId', e.target.value)} className={selectClass} disabled={!v.locationId}>
              <option value="">{v.locationId ? 'Pilih paket…' : 'Pilih kolam dulu'}</option>
              {paketForLokasi.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
          <label className="block font-semibold mb-3">
            Pertemuan pertama
            <input name="firstMeetDate" type="date" value={v.firstMeetDate} onChange={(e) => set('firstMeetDate', e.target.value)} className={inputClass} />
          </label>
          <label className="block font-semibold mb-3">
            Sesi pertemuan pertama
            <select name="firstMeetSession" value={v.firstMeetSession} onChange={(e) => set('firstMeetSession', e.target.value)} className={selectClass}>
              {['Sesi 1', 'Sesi 2', 'Sesi 3'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block font-semibold mb-3">
            Pelatih
            <select name="instructorId" value={v.instructorId} onChange={(e) => set('instructorId', e.target.value)} className={selectClass}>
              <option value="">{instructors.length ? 'Pilih pelatih…' : 'Data pelatih belum tersambung'}</option>
              {instructors.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <label className="block font-semibold mb-3">
            Metode pembayaran
            <select name="paymentMethod" value={v.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={selectClass}>
              {PAYMENT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>Kembali</Button>
            <Button type="submit">Lanjut</Button>
          </div>
        </form>
      ) : (
        <form className="rounded-lg border border-gray-200 bg-white p-4" onSubmit={submit}>
          <dl className="grid gap-x-6 [grid-template-columns:1fr] min-[640px]:[grid-template-columns:160px_1fr]">
            {[
              ['Nama lengkap', v.fullName],
              ['Tempat & tanggal lahir', `${v.birthPlace}, ${v.birthDate}`],
              ['Jenis kelamin', v.gender],
              ['Alamat', v.address],
              ['Telepon', v.phone],
              ['Email', v.email],
              ['Sekolah / kantor', v.schoolOrOffice],
              ['Ukuran kaos', v.tshirtSize],
              ['Kolam', locations.find((l) => l.id === v.locationId)?.label ?? ''],
              ['Paket', paketForLokasi.find((p) => p.id === v.packageId)?.label ?? ''],
              ['Pertemuan pertama', `${v.firstMeetDate} — ${v.firstMeetSession}`],
              ['Pelatih', instructors.find((t) => t.id === v.instructorId)?.label ?? ''],
              ['Metode bayar', v.paymentMethod],
              ['Foto profil', foto ? foto.name : '—'],
              ['Bukti bayar', bukti ? bukti.name : '—'],
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
