import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

//shows navigation path on top of the page
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Enrollment', href: '/enrollment' },
];

interface Student {
    id: number;
    index_no: string;
    full_name: string;
    current_semester: number;
    email: string;
    contact: string;
}

interface Semester {
    id: number;
    semester_name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    semester_level: number;
}

interface Payment {
    id: number;
    installment_number: number;
    amount: number;
    valid_from: string;
    valid_to: string;
    verified_date: string;
}

interface Enrollment {
    id: number;
    enrollment_date: string;
    status: string;
}

interface Props {
    student: Student;
    semester: Semester | null;
    alreadyEnrolled: boolean;
    canEnroll: boolean;
    fullyPaid: boolean;
    paidCount: number;
    payments: Payment[];
    enrollment: Enrollment | null;
    errors: Record<string, string>;
    flash: { success?: string };
    [key: string]: unknown;
}

export default function EnrollmentIndex() {
    const {
        student, semester, alreadyEnrolled, canEnroll,
        fullyPaid, paidCount, payments, enrollment, errors,
    } = usePage<Props>().props as unknown as Props & { errors: Record<string, string> };

    // Read flash success from Inertia shared data
    const { flash } = usePage<Props>().props;
    const handleEnroll = () => {
        if (window.confirm('Are you sure you want to enroll for this semester?')) {
            router.post('/enrollment');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollment" />
            <div className="flex flex-1 flex-col gap-6 p-6">

                {/* Flash success banner */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-300 p-4 text-green-700 font-medium">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Student Info */}
                <Card className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Semester Enrollment</h1>
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
                            {/* Now shows semester_level number which matches the semester */}
                            <p className="font-semibold">Semester {student.current_semester}</p>
                        </div>
                    </div>
                </Card>

                {!semester && (
                    <Card className="p-6 border-yellow-500">
                        <p className="text-yellow-500 font-semibold">
                            No semester found. Please contact the admin.
                        </p>
                    </Card>
                )}

                {semester && (
                    <>
                        {/* Active Semester — now correctly shows the student's paid semester */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4">Active Semester</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Semester</p>
                                    <p className="font-semibold">{semester.semester_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Academic Year</p>
                                    <p className="font-semibold">{semester.academic_year}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Period</p>
                                    <p className="font-semibold">{semester.start_date} → {semester.end_date}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Fee Installments */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4">Fee Payment Status</h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                                {[1, 2, 3].map(num => {
                                    const paid = payments.find(p => p.installment_number === num);
                                    return (
                                        <div
                                            key={num}
                                            className={`rounded-lg border p-4 ${
                                                paid
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            <p className="font-semibold mb-1">Installment {num}</p>
                                            {paid ? (
                                                <>
                                                    <p className="text-xs text-green-600 font-semibold">✓ Paid</p>
                                                    <p className="text-xs text-muted-foreground mt-1">LKR {paid.amount}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Valid: {paid.valid_from} → {paid.valid_to}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-red-500">✗ Not Paid</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mb-4">
                                <span className="text-sm text-muted-foreground mr-2">Overall Fee Status:</span>
                                {fullyPaid ? (
                                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        ✓ Fully Paid
                                    </span>
                                ) : paidCount > 0 ? (
                                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        {paidCount}/3 Installments Paid
                                    </span>
                                ) : (
                                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                        No Installments Paid
                                    </span>
                                )}
                            </div>

                            <div className="mb-6">
                                <span className="text-sm text-muted-foreground mr-2">Enrollment Status:</span>
                                {alreadyEnrolled ? (
                                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        ✓ Enrolled — {enrollment?.enrollment_date}
                                    </span>
                                ) : (
                                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        Not Enrolled Yet
                                    </span>
                                )}
                            </div>

                            {errors?.enrollment && (
                                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {errors.enrollment}
                                </div>
                            )}

                            {/* Only show enroll button if not yet enrolled and has paid */}
                            {!alreadyEnrolled && (
                                <>
                                    <Button
                                        onClick={handleEnroll}
                                        disabled={!canEnroll}
                                        className="w-full md:w-auto"
                                    >
                                        {canEnroll
                                            ? 'Confirm Enrollment'
                                            : 'Pay At Least 1st Installment to Enroll'}
                                    </Button>
                                    {canEnroll && paidCount < 3 && (
                                        <p className="text-xs text-yellow-600 mt-2">
                                            Note: You can enroll now but must complete remaining {3 - paidCount} installment(s) during the semester.
                                        </p>
                                    )}
                                </>
                            )}

                            {alreadyEnrolled && (
                                <p className="text-sm text-green-600 font-medium">
                                    ✓ You are successfully enrolled for this semester.
                                    {!fullyPaid && (
                                        <span className="block text-yellow-600 mt-1">
                                            Please complete your remaining {3 - paidCount} installment(s).
                                        </span>
                                    )}
                                </p>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
