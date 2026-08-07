<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student List Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #222; }
        h1 { font-size: 18px; margin-bottom: 2px; }
        p.meta { color: #666; margin-top: 0; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; } /*draw a 1px solid light-gray border.*/
        th { background-color: #f0f0f0; }
        tr:nth-child(even) { background-color: #fafafa; }   /*RGB = (250, 250, 250)*/
    </style>
</head>
<body>
    <h1>OpenArc Campus – Student List Report</h1>
    <p class="meta">
        Generated: {{ now()->format('Y-m-d H:i') }} &nbsp;|&nbsp;
        Total students: {{ $students->count() }}
    </p>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Index No.</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Current Semester</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($students as $i => $s)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $s->index_no }}</td>
                    <td>{{ $s->full_name }}</td>
                    <td>{{ $s->contact }}</td>
                    <td>{{ $s->email }}</td>
                    <td>Semester {{ $s->current_semester }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align:center;">No students found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>