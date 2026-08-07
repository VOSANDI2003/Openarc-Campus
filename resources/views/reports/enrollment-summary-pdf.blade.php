<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Enrollment Summary Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #222; }
        h1 { font-size: 18px; margin-bottom: 2px; }
        p.meta { color: #666; margin-top: 0; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        tr:nth-child(even) { background-color: #fafafa; }
        td.num { text-align: right; }
    </style>
</head>
<body>
    <h1>OpenArc Campus – Enrollment Summary Report</h1>
    <p class="meta">
        Generated: {{ now()->format('Y-m-d') }}
        @if($academicYear) &nbsp;|&nbsp; Academic Year: {{ $academicYear }} @endif
        &nbsp;|&nbsp; Total enrolled: {{ $totalEnrolled }}
    </p>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Period</th>
                <th>Active</th>
                <th>Enrolled</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($semesters as $i => $s)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $s->semester_name }}</td>
                    <td>{{ $s->academic_year }}</td>
                    <td>{{ $s->start_date }} &ndash; {{ $s->end_date }}</td>
                    <td>{{ $s->is_active ? 'Yes' : 'No' }}</td>
                    <td class="num">{{ $s->enrolled_count }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align:center;">No semesters found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>