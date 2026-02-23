import { isAdmin } from '@/app/actions';
import { redirect } from 'next/navigation';
import QRGenerator from '@/components/QRGenerator';

export const metadata = {
    title: 'QR Manager - Hotel Service'
};

export default async function QRManagerPage() {
    if (!(await isAdmin())) {
        redirect('/admin/login');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    return <QRGenerator baseUrl={baseUrl} />;
}
