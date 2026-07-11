import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Student {
    id: number;
    index_no: string;
    full_name: string;
    contact: string;
    email: string;
    current_semester: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '#' },
    { title: 'Student List', href: '/reports/students' },
];

export default function StudentListReport() {
    const { students, semesters, filters } = usePage<{
        students?: Student[];
        semesters?: number[];
        filters?: { search: string | null; semester: string | null };
    }>().props;

    const studentList = students ?? [];
    const semesterOptions = semesters ?? [];

    const [search, setSearch] = useState(filters?.search ?? '');
    const [selectedSemester, setSelectedSemester] = useState(filters?.semester ?? '');

    // Search is still done client-side on the already-loaded list (fast, no server round-trip).
    const filtered = studentList.filter(s => {
        const term = search.toLowerCase();
        return (
            s.full_name.toLowerCase().includes(term) ||
            s.index_no.toLowerCase().includes(term)   ||
            s.email.toLowerCase().includes(term)
        );
    });

    // Semester filter goes to the server, since it changes which rows were fetched in the first place.
    const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const semester = e.target.value;
        setSelectedSemester(semester);
        router.get(
            '/reports/students',
            semester ? { semester } : {},
            { preserveState: true, replace: true },
        );
    };

    const pdfHref = selectedSemester
        ? `/reports/students/pdf?semester=${encodeURIComponent(selectedSemester)}`
        : '/reports/students/pdf';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Student List Report</h1>
                        <p className="text-sm text-gray-500">{filtered.length} of {studentList.length} students</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedSemester}
                            onChange={handleSemesterChange}
                            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-800"
                        >
                            <option value="">All semesters</option>
                            {semesterOptions.map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                        <Input
                            placeholder="Search by name, index no. or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-64"
                        />
                        <Button asChild>
                            <a href={pdfHref}>Download PDF</a>
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">#</th>
                                <th className="px-4 py-2 text-left font-semibold">Index No.</th>
                                <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Contact</th>
                                <th className="px-4 py-2 text-left font-semibold">Email</th>
                                <th className="px-4 py-2 text-left font-semibold">Current Semester</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s, index) => (
                                    <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{s.index_no}</td>
                                        <td className="px-4 py-2">{s.full_name}</td>
                                        <td className="px-4 py-2">{s.contact}</td>
                                        <td className="px-4 py-2">{s.email}</td>
                                        <td className="px-4 py-2">Semester {s.current_semester}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AppLayout>
    );
}