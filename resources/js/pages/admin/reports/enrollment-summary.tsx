import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Semester {
    id: number;
    semester_name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    enrolled_count: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '#' },
    { title: 'Enrollment Summary', href: '/reports/enrollment-summary' },
];

export default function EnrollmentSummaryReport() {
    const { semesters, academicYears, filters, totalEnrolled } = usePage<{
        semesters?: Semester[];
        academicYears?: string[];
        filters?: { academic_year: string | null };
        totalEnrolled?: number;
    }>().props;

    const semesterList = semesters ?? [];
    const years = academicYears ?? [];
    const selectedYear = filters?.academic_year ?? '';

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        router.get(
            '/reports/enrollment-summary',
            year ? { academic_year: year } : {},
            { preserveState: true, replace: true },
        );
    };

    // Keep the currently-selected academic year filter applied to the PDF download too
    const pdfHref = selectedYear
        ? `/reports/enrollment-summary/pdf?academic_year=${encodeURIComponent(selectedYear)}`
        : '/reports/enrollment-summary/pdf';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Enrollment Summary Report</h1>
                        <p className="text-sm text-gray-500">Total enrolled: {totalEnrolled ?? 0}</p>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-800"
                        >
                            <option value="">All academic years</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
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
                                <th className="px-4 py-2 text-left font-semibold">Semester</th>
                                <th className="px-4 py-2 text-left font-semibold">Academic Year</th>
                                <th className="px-4 py-2 text-left font-semibold">Period</th>
                                <th className="px-4 py-2 text-left font-semibold">Active</th>
                                <th className="px-4 py-2 text-right font-semibold">Enrolled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semesterList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                                        No semesters found.
                                    </td>
                                </tr>
                            ) : (
                                semesterList.map((s, index) => (
                                    <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{s.semester_name}</td>
                                        <td className="px-4 py-2">{s.academic_year}</td>
                                        <td className="px-4 py-2">{s.start_date} – {s.end_date}</td>
                                        <td className="px-4 py-2">{s.is_active ? 'Yes' : 'No'}</td>
                                        <td className="px-4 py-2 text-right font-medium">{s.enrolled_count}</td>
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