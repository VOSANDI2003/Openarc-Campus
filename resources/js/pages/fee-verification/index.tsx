import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Fee Verification', href: '/fee-verification' },
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
}

interface Payment {
    id: number;
    installment_number: number;
    amount: number;
    valid_from: string;
    valid_to: string;
    verified_date: string;
}

interface Props {
    semesters: Semester[];
    selectedSemester: Semester | null;
    student: Student | null;
    payments: Payment[];
    success: string | null;
    errors: Record<string, string>;
    [key: string]: unknown;
}

const emptyForm = {
    payment_type: 'installment' as 'installment' | 'full',
    installment_number: '1',
    amount: '',
    valid_from: '',
    valid_to: '',
};

export default function FeeVerificationIndex() {
    const { semesters, selectedSemester, student, payments, success, errors } =
        usePage<Props>().props as unknown as Props & { errors: Record<string, string> };

    const [indexNo, setIndexNo]       = useState('');
    const [semesterId, setSemesterId] = useState(selectedSemester?.id?.toString() ?? '');
    const [form, setForm]             = useState(emptyForm);

    // Compute unpaid installments from current payments
    const paidNumbers = payments.map(p => p.installment_number);
    const allPaid     = paidNumbers.length === 3;
    const unpaidNums  = [1, 2, 3].filter(n => !paidNumbers.includes(n));

    // Auto-select the first unpaid installment whenever payments change
    useEffect(() => {
        if (unpaidNums.length > 0) {
            setForm(f => ({ ...f, installment_number: unpaidNums[0].toString() }));
        }
    }, [payments]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/fee-verification/search', {
            index_no:    indexNo,
            semester_id: semesterId,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!student || !selectedSemester) return;

        const label = form.payment_type === 'full'
            ? `full payment of LKR ${form.amount}`
            : `Installment ${form.installment_number} of LKR ${form.amount}`;

        if (window.confirm(`Confirm ${label} for ${student.full_name}?`)) {
            router.post('/fee-verification/verify', {
                student_id:         student.id,
                semester_id:        selectedSemester.id,
                payment_type:       form.payment_type,
                installment_number: form.installment_number,
                amount:             form.amount,
                valid_from:         form.valid_from,
                valid_to:           form.valid_to,
            }, {
                onSuccess: () => {
                    // Reset amount and dates but keep payment_type
                    setForm(f => ({
                        ...f,
                        amount:    '',
                        valid_from:'',
                        valid_to:  '',
                    }));
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee Verification" />
            <div className="flex flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <Card className="p-6">
                    <h1 className="text-2xl font-bold mb-2">Fee Verification</h1>
                    <p className="text-sm text-muted-foreground">
                        Select the semester and search for a student to verify fee payments.
                    </p>
                </Card>

                {/* Success message */}
                {success && (
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 font-medium border border-green-300">
                        ✓ {success}
                    </div>
                )}

                {/* Search */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold mb-4">Search Student</h2>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
                        <div>
                            <Label>Select Semester</Label>
                            <select
                                value={semesterId}
                                onChange={e => setSemesterId(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                required
                            >
                                <option value="">-- Select Semester --</option>
                                {semesters.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.semester_name} — {s.academic_year}
                                    </option>
                                ))}
                            </select>
                            {errors?.semester_id && (
                                <p className="text-xs text-red-500 mt-1">{errors.semester_id}</p>
                            )}
                        </div>

                        <div>
                            <Label>Student Index No</Label>
                            <Input
                                value={indexNo}
                                onChange={e => setIndexNo(e.target.value)}
                                placeholder="e.g. 2324001"
                                required
                            />
                            {errors?.index_no && (
                                <p className="text-xs text-red-500 mt-1">{errors.index_no}</p>
                            )}
                        </div>

                        <div>
                            <Button type="submit" className="w-full">Search</Button>
                        </div>
                    </form>
                </Card>

                {/* Student Found */}
                {student && selectedSemester && (
                    <>
                        {/* Student Details */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-1">Student Details</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Semester: <span className="font-semibold text-foreground">{selectedSemester.semester_name} — {selectedSemester.academic_year}</span>
                                &nbsp;|&nbsp; Period: <span className="font-semibold text-foreground">{selectedSemester.start_date} → {selectedSemester.end_date}</span>
                            </p>
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
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-semibold">{student.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Contact</p>
                                    <p className="font-semibold">{student.contact}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Installment Status */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4">Installment Status</h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                                {[1, 2, 3].map(num => {
                                    const paid = payments.find(p => p.installment_number === num);
                                    return (
                                        <div key={num} className={`rounded-lg border p-4 ${paid ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                                            <p className="font-semibold mb-1">Installment {num}</p>
                                            {paid ? (
                                                <>
                                                    <p className="text-xs text-green-600 font-semibold">✓ Paid</p>
                                                    <p className="text-xs text-muted-foreground mt-1">LKR {paid.amount}</p>
                                                    <p className="text-xs text-muted-foreground">Valid: {paid.valid_from} → {paid.valid_to}</p>
                                                    <p className="text-xs text-muted-foreground">Verified: {paid.verified_date}</p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-red-500">✗ Not Paid</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Overall status */}
                            <div className="mb-6">
                                <span className="text-sm text-muted-foreground mr-2">Overall Fee Status:</span>
                                {allPaid ? (
                                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        ✓ Fully Paid
                                    </span>
                                ) : (
                                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        {paidNumbers.length}/3 Installments Paid
                                    </span>
                                )}
                            </div>

                            {/* Error */}
                            {errors?.installment && (
                                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {errors.installment}
                                </div>
                            )}

                            {/* Record payment form */}
                            {!allPaid && (
                                <>
                                    <h3 className="font-semibold mb-3">Record Payment</h3>
                                    <form onSubmit={handleVerify} className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                        <div className="md:col-span-2">
                                            <Label>Payment Type</Label>
                                            <select
                                                name="payment_type"
                                                value={form.payment_type}
                                                onChange={handleChange}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                required
                                            >
                                                <option value="installment">Single Installment</option>
                                                <option value="full">Full Payment (All Remaining)</option>
                                            </select>
                                        </div>

                                        {form.payment_type === 'installment' && (
                                            <div>
                                                <Label>Installment Number</Label>
                                                <select
                                                    name="installment_number"
                                                    value={form.installment_number}
                                                    onChange={handleChange}
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    required
                                                >
                                                    {unpaidNums.map(n => (
                                                        <option key={n} value={n}>Installment {n}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <Label>Amount (LKR)</Label>
                                            <Input
                                                name="amount"
                                                type="number"
                                                min="0"
                                                value={form.amount}
                                                onChange={handleChange}
                                                placeholder="e.g. 25000"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label>Valid From</Label>
                                            <Input
                                                name="valid_from"
                                                type="date"
                                                value={form.valid_from}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label>Valid To</Label>
                                            <Input
                                                name="valid_to"
                                                type="date"
                                                value={form.valid_to}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                                {form.payment_type === 'full'
                                                    ? 'Record Full Payment'
                                                    : `Record Installment ${form.installment_number}`}
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {allPaid && (
                                <p className="text-sm text-green-600 font-medium">
                                    ✓ All installments paid. Student is fully paid for this semester.
                                </p>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}