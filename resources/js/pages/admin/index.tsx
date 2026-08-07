import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Admin {
    id: number;
    user_id: number;
    employee_id: string;
    full_name: string;
    email: string;
}

// `flash` carries one-off success messages set via ->with('success', ...)
// on the backend, for both the add (store) and update actions.
interface Props {
    admins?: Admin[];
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admins', href: '/admins' },
];

const emptyForm = {
    employee_id: '',
    full_name: '',
    email: '',
    password: '',
};

type FormState = typeof emptyForm & { id?: number };

export default function AdminIndex() {
    const { admins, flash } = usePage<Props>().props;
    const adminList = admins ?? [];

    const [open, setOpen]     = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm]     = useState<FormState>(emptyForm);
    const [search, setSearch] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (a: Admin) => {
        setForm({
            id: a.id,
            employee_id: a.employee_id,
            full_name: a.full_name,
            email: a.email,
            password: '',
        });
        setErrors({});
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    // Handles both add and update submissions; success flash is set on the backend for both.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/admins/${form.id}`, form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        } else {
            router.post('/admins', form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            router.delete(`/admins/${id}`);
        }
    };

    const filtered = adminList.filter(a => {
        const term = search.toLowerCase();
        return (
            a.employee_id.toLowerCase().includes(term) ||
            a.full_name.toLowerCase().includes(term)   ||
            a.email.toLowerCase().includes(term)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                {/* Flash success banner — shown after both Add and Update actions */}
                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-50 border border-green-300 p-4 text-green-700 font-medium">
                        ✓ {flash.success}
                    </div>
                )}

                <Card className="p-6 mt-0">
                    <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold">Admins</h1>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search admins…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-56"
                            />
                            <Button onClick={handleOpenAdd}>Add Admin</Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm rounded-lg">
                            <thead className="bg-gray-100 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold">ID</th>
                                    <th className="px-4 py-2 text-left font-semibold">Employee ID</th>
                                    <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                            No admins found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((a, index) => (
                                        <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{a.employee_id}</td>
                                            <td className="px-4 py-2">{a.full_name}</td>
                                            <td className="px-4 py-2">{a.email}</td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleOpenEdit(a)}>Edit</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(a.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Admin' : 'Add Admin'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Employee ID</Label>
                            <Input name="employee_id" value={form.employee_id} onChange={handleChange} required />
                            {errors.employee_id && <p className="text-xs text-red-500 mt-1">{errors.employee_id}</p>}
                        </div>
                        <div>
                            <Label>Full Name</Label>
                            <Input name="full_name" value={form.full_name} onChange={handleChange} required />
                            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        {!isEdit && (
                            <div>
                                <Label>Password</Label>
                                <Input name="password" type="password" value={form.password} onChange={handleChange} required />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Add'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}