import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';


//add front desk people from admin 
interface FrontDesk {
    id: number;
    user_id: number;
    fd_id: string;
    full_name: string;
    email: string;
    contact: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Front Desk', href: '/front-desks' },
];

const emptyForm = {
    fd_id: '',
    full_name: '',
    email: '',
    contact: '',
    password: '',
};

type FormState = typeof emptyForm & { id?: number };

export default function FrontDeskIndex() {
    const { frontDesks } = usePage<{ frontDesks?: FrontDesk[] }>().props;
    const frontDeskList = frontDesks ?? [];

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

    const handleOpenEdit = (fd: FrontDesk) => {
        setForm({
            id: fd.id,
            fd_id: fd.fd_id,
            full_name: fd.full_name,
            email: fd.email,
            contact: fd.contact,
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
            router.put(`/front-desks/${form.id}`, form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        } else {
            router.post('/front-desks', form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this Front Desk staff?')) {
            router.delete(`/front-desks/${id}`);
        }
    };

    const filtered = frontDeskList.filter(fd => {
        const term = search.toLowerCase();
        return (
            fd.fd_id.toLowerCase().includes(term)    ||
            fd.full_name.toLowerCase().includes(term) ||
            fd.email.toLowerCase().includes(term)     ||
            fd.contact.includes(term)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Front Desk Staff</h1>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search front desk…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-56"
                        />
                        <Button onClick={handleOpenAdd}>Add Front Desk</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">FD ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Email</th>
                                <th className="px-4 py-2 text-left font-semibold">Contact</th>
                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                                        No front desk staff found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((fd, index) => (
                                    <tr key={fd.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{fd.fd_id}</td>
                                        <td className="px-4 py-2">{fd.full_name}</td>
                                        <td className="px-4 py-2">{fd.email}</td>
                                        <td className="px-4 py-2">{fd.contact}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleOpenEdit(fd)}>Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(fd.id)}>Delete</Button>
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
                        <DialogTitle>{isEdit ? 'Update Front Desk' : 'Add Front Desk'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>FD ID</Label>
                            <Input name="fd_id" value={form.fd_id} onChange={handleChange} required />
                            {errors.fd_id && <p className="text-xs text-red-500 mt-1">{errors.fd_id}</p>}
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
