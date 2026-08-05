import AppLayout from '@/layouts/app-layout'; //common wrapper of the page
import { router, usePage } from '@inertiajs/react'; //send POST/PUT/DELETE requests without reload page(laravel), read props sent from laravel (route)in here students list
import { Card } from '@/components/ui/card'; //common card wrapper
import { Button } from '@/components/ui/button'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react'; //store values that change over time in the component
import { type BreadcrumbItem } from '@/types';

//This shows what fields a Student has (no effect on runtime, just to check typescript type)
interface Student {
    id: number;
    user_id: number;
    index_no: string;
    full_name: string;
    email: string;
    contact: string;
    current_semester: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/students' },
];

//default state of the form(blank)
const emptyForm = {
    index_no: '',
    full_name: '',
    email: '',
    contact: '',
    current_semester: 1,
    password: '',
};

//adding optional id alike empty format shape(omly use when edit)
type FormState = typeof emptyForm & { id?: number };

export default function StudentIndex() {
    const { students } = usePage<{ students?: Student[] }>().props;
    const studentList = students ?? [];


    
    const [open, setOpen]     = useState(false);                        //add edit dialog(popup)
    const [isEdit, setIsEdit] = useState(false);                        //edit mode or add mode
    const [form, setForm]     = useState<FormState>(emptyForm);         //vlaues thet are typed in the form
    const [search, setSearch] = useState('');                           //search term typed in the search box
    const [errors, setErrors] = useState<Record<string, string>>({});   //validation error messages came from laravel according to field name, e.g. { full_name: "Full Name is required" }

    //resets the form to blank, marks it as "not edit mode," opens the dialog.
    const handleOpenAdd = () => {
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setOpen(true);
    };

    //fills the form with the selected student's data, marks it as "edit mode," opens the dialog.
    const handleOpenEdit = (s: Student) => {
        setForm({
            id: s.id,
            index_no: s.index_no,
            full_name: s.full_name,
            email: s.email,
            contact: s.contact,
            current_semester: s.current_semester,
            password: '',
        });
        setErrors({});
        setIsEdit(true);
        setOpen(true);
    };

    //closes the dialog and resets everything.
    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
    };

    //runs every time you type in any input field.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.name === 'current_semester'
            ? Number(e.target.value)
            : e.target.value;
        setForm({ ...form, [e.target.name]: value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };
    //runs when you click Add/Update
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/students/${form.id}`, form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        } else {
            router.post('/students', form, {
                onSuccess: handleClose,
                onError: errs => setErrors(errs as Record<string, string>),
            });
        }
    };

    //runs when you click Delete on a student row. Asks for confirmation, then sends a DELETE request to the server.
    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            router.delete(`/students/${id}`);
        }
    };

    //filter the student list based on the search term (index number, name, email, contact). this completely happens on browser not sending req to server. so it is fast.
    const filtered = studentList.filter(s => {
        const term = search.toLowerCase();
        return (
            s.index_no.toLowerCase().includes(term)  ||
            s.full_name.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term)     ||
            s.contact.includes(term)
        );
    });

    return (
        // The AppLayout component likely includes the main layout of the page, including navigation, header.
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search students…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-56"
                        />
                        
                        <Button onClick={handleOpenAdd}>Add Student</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Index No</th>
                                <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Email</th>
                                <th className="px-4 py-2 text-left font-semibold">Contact</th>
                                <th className="px-4 py-2 text-left font-semibold">Semester</th>
                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                // Maps over the filtered list of students and renders a table row for each student.
                                filtered.map((s, index) => (
                                    <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{s.index_no}</td>
                                        <td className="px-4 py-2">{s.full_name}</td>
                                        <td className="px-4 py-2">{s.email}</td>
                                        <td className="px-4 py-2">{s.contact}</td>
                                        <td className="px-4 py-2">{s.current_semester}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleOpenEdit(s)}>Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>Delete</Button>
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
                        <DialogTitle>{isEdit ? 'Update Student' : 'Add Student'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Index No</Label>
                            <Input name="index_no" value={form.index_no} onChange={handleChange} required />
                            {errors.index_no && <p className="text-xs text-red-500 mt-1">{errors.index_no}</p>}
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
                            <Label>Current Semester</Label>
                            <Input
                                name="current_semester"
                                type="number"
                                min={1}
                                max={8}
                                value={form.current_semester}
                                onChange={handleChange}
                                required
                            />
                            {errors.current_semester && <p className="text-xs text-red-500 mt-1">{errors.current_semester}</p>}
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
