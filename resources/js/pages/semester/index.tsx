import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Semesters', href: '/semesters' },
];

interface Semester {
    id: number;
    semester_name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

interface Props {
    semesters: Semester[];
    [key: string]: unknown;
}

const emptyForm = {
    semester_name: '',
    academic_year: '',
    start_date: '',
    end_date: '',
};

type FormState = typeof emptyForm & { id?: number };

export default function SemesterIndex() {
    const { semesters } = usePage<Props>().props as unknown as Props;
    const semesterList  = semesters ?? [];

    const [open, setOpen]     = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm]     = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [search, setSearch] = useState('');

    // Filter semesters by name or academic year
    const filteredSemesters = semesterList.filter((s) =>
        s.semester_name.toLowerCase().includes(search.toLowerCase()) ||
        s.academic_year.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (s: Semester) => {
        setForm({
            id:            s.id,
            semester_name: s.semester_name,
            academic_year: s.academic_year,
            start_date:    s.start_date,
            end_date:      s.end_date,
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
            router.put(`/semesters/${form.id}`, form, {
                onSuccess: handleClose,
                onError:   errs => setErrors(errs as Record<string, string>),
            });
        } else {
            router.post('/semesters', form, {
                onSuccess: handleClose,
                onError:   errs => setErrors(errs as Record<string, string>),
            });
        }
    };

    const handleToggle = (s: Semester) => {
        const action = s.is_active ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} "${s.semester_name}"?`)) {
            router.put(`/semesters/${s.id}/toggle`);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this semester?')) {
            router.delete(`/semesters/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semesters" />
            <div className="flex flex-1 flex-col gap-6 p-6">

                <Card className="p-6">
                    <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold">Semester Management</h1>
                        <Button onClick={handleOpenAdd}>Add Semester</Button>
                    </div>

                    {/* Search bar */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Search by semester name or academic year..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm rounded-lg">
                            <thead className="bg-gray-100 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold">ID</th>
                                    <th className="px-4 py-2 text-left font-semibold">Semester</th>
                                    <th className="px-4 py-2 text-left font-semibold">Academic Year</th>
                                    <th className="px-4 py-2 text-left font-semibold">Start Date</th>
                                    <th className="px-4 py-2 text-left font-semibold">End Date</th>
                                    <th className="px-4 py-2 text-left font-semibold">Status</th>
                                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSemesters.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                                            No semesters found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSemesters.map((s, index) => (
                                        <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2 font-medium">{s.semester_name}</td>
                                            <td className="px-4 py-2">{s.academic_year}</td>
                                            <td className="px-4 py-2">{s.start_date}</td>
                                            <td className="px-4 py-2">{s.end_date}</td>
                                            <td className="px-4 py-2">
                                                {s.is_active ? (
                                                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        ✓ Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2 flex-wrap">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={s.is_active
                                                            ? 'border-red-400 text-red-600 hover:bg-red-50'
                                                            : 'border-green-500 text-green-600 hover:bg-green-50'
                                                        }
                                                        onClick={() => handleToggle(s)}
                                                    >
                                                        {s.is_active ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(s)}>
                                                        Edit
                                                    </Button>
                                                    {!s.is_active && (
                                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Semester' : 'Add Semester'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Semester Name</Label>
                            <Input
                                name="semester_name"
                                value={form.semester_name}
                                onChange={handleChange}
                                placeholder="e.g. Semester 1"
                                required
                            />
                            {errors.semester_name && <p className="text-xs text-red-500 mt-1">{errors.semester_name}</p>}
                        </div>
                        <div>
                            <Label>Academic Year</Label>
                            <Input
                                name="academic_year"
                                value={form.academic_year}
                                onChange={handleChange}
                                placeholder="e.g. 2025/2026"
                                required
                            />
                            {errors.academic_year && <p className="text-xs text-red-500 mt-1">{errors.academic_year}</p>}
                        </div>
                        <div>
                            <Label>Start Date</Label>
                            <Input
                                name="start_date"
                                type="date"
                                value={form.start_date}
                                onChange={handleChange}
                                required
                            />
                            {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>}
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <Input
                                name="end_date"
                                type="date"
                                value={form.end_date}
                                onChange={handleChange}
                                required
                            />
                            {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>}
                        </div>
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