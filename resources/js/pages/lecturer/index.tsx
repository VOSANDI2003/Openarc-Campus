import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Lecturer {
    id: number;
    user_id: number;
    lecturer_id: string;
    full_name: string;
    email: string;
    contact: string;
    subject: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Lecturers', href: '/lecturers' },
];

const emptyForm = {
    lecturer_id: '',
    full_name: '',
    email: '',
    contact: '',
    subject: '',
    password: '',
};

type FormState = typeof emptyForm & { id?: number };

export default function LecturerIndex() {
    const { lecturers } = usePage<{ lecturers?: Lecturer[] }>().props;
    const lecturerList = lecturers ?? [];

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

    const handleOpenEdit = (l: Lecturer) => {
        setForm({
            id: l.id,
            lecturer_id: l.lecturer_id,
            full_name: l.full_name,
            email: l.email,
            contact: l.contact,
            subject: l.subject,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/lecturers/${form.id}`, form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        } else {
            router.post('/lecturers', form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this lecturer?')) {
            router.delete(`/lecturers/${id}`);
        }
    };

    const filtered = lecturerList.filter(l => {
        const term = search.toLowerCase();
        return (
            l.lecturer_id.toLowerCase().includes(term) ||
            l.full_name.toLowerCase().includes(term)   ||
            l.email.toLowerCase().includes(term)       ||
            l.subject.toLowerCase().includes(term)  ||
            l.contact.includes(term)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Lecturers</h1>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search lecturers…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-56"
                        />
                        <Button onClick={handleOpenAdd}>Add Lecturer</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Lecturer ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Email</th>
                                <th className="px-4 py-2 text-left font-semibold">Contact</th>
                                <th className="px-4 py-2 text-left font-semibold">Subject</th>
                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                                        No lecturers found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((l, index) => (
                                    <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{l.lecturer_id}</td>
                                        <td className="px-4 py-2">{l.full_name}</td>
                                        <td className="px-4 py-2">{l.email}</td>
                                        <td className="px-4 py-2">{l.contact}</td>
                                        <td className="px-4 py-2">{l.subject}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleOpenEdit(l)}>Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(l.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Lecturer' : 'Add Lecturer'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Lecturer ID</Label>
                            <Input name="lecturer_id" value={form.lecturer_id} onChange={handleChange} required />
                            {errors.lecturer_id && <p className="text-xs text-red-500 mt-1">{errors.lecturer_id}</p>}
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
                        <div>
                            <Label>Contact</Label>
                            <Input name="contact" value={form.contact} onChange={handleChange} required />
                            {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
                        </div>
                        <div>
                            <Label>Subject</Label>
                            <Input name="subject" value={form.subject} onChange={handleChange} required />
                            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
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
