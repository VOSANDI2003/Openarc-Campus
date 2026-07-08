import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Fee Status', href: '/fee-status' },
];

interface Student {
    id: number;
    index_no: string;
    full_name: string;
    current_semester: number;
}

interface Semester {
    id: number;
    semester_name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
}

interface Installment {
    id: number;
    installment_number: number;
    amount: number;
    valid_from: string;
    valid_to: string;
    verified_date: string;
    is_paid: boolean;
}

interface GroupedPayment {
    semester: Semester;
    installments: Installment[];
    total_paid: number;
    paid_count: number;
    fully_paid: boolean;
}

interface Props {
    student: Student | null;
    grouped: GroupedPayment[];
    [key: string]: unknown;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
}

export default function FeeStatusIndex() {
    const { student, grouped } = usePage<Props>().props as unknown as Props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee Status" />
            <div className="flex flex-1 flex-col gap-6 p-6">

                {/* Student not yet added by admin/front desk */}
                {!student ? (
                    <Card className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Fee Payment History</h1>
                        <p className="text-sm text-muted-foreground">
                            Your student profile has not been set up yet. Please contact the front desk or admin to complete your registration. Your fee status will be available once your profile is activated.
                        </p>
                    </Card>
                ) : (
                    <>
                        {/* Student Info */}
                        <Card className="p-6">
                            <h1 className="text-2xl font-bold mb-4">Fee Payment History</h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Student ID</p>
                                    <p className="font-semibold">{student.index_no}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-semibold">{student.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Current Semester</p>
                                    <p className="font-semibold">Semester {student.current_semester}</p>
                                </div>
                            </div>
                        </Card>

                        {/* No payments yet */}
                        {grouped.length === 0 && (
                            <Card className="p-6">
                                <p className="text-muted-foreground text-sm">
                                    No fee payments recorded yet. Please contact the front desk.
                                </p>
                            </Card>
                        )}

                        {/* Payment history per semester */}
                        {grouped.map((group) => (
                            <Card key={group.semester.id} className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold">{group.semester.semester_name}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {group.semester.academic_year} &nbsp;|&nbsp;
                                            {formatDate(group.semester.start_date)} → {formatDate(group.semester.end_date)}
                                        </p>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">Total Paid:</span>
                                        <span className="font-bold text-blue-500">LKR {Number(group.total_paid).toLocaleString()}</span>
                                        {group.fully_paid ? (
                                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                ✓ Fully Paid
                                            </span>
                                        ) : (
                                            <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                                {group.paid_count}/3 Paid
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {[1, 2, 3].map(num => {
                                        const inst = group.installments.find(i => i.installment_number === num);
                                        return (
                                            <div
                                                key={num}
                                                className={`rounded-lg border p-4 ${
                                                    inst
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            >
                                                <p className="font-semibold mb-2">Installment {num}</p>
                                                {inst ? (
                                                    <>
                                                        <p className="text-xs text-green-600 font-semibold">✓ Paid</p>
                                                        <div className="mt-2 space-y-1">
                                                            <p className="text-xs text-muted-foreground">
                                                                Amount: <span className="font-semibold text-foreground">LKR {Number(inst.amount).toLocaleString()}</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Valid: {formatDate(inst.valid_from)} → {formatDate(inst.valid_to)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Verified: {formatDate(inst.verified_date)}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-red-500">✗ Not Paid</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </AppLayout>
    );
}