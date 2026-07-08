<!DOCTYPE html>
<html>
<head>
    <title>Teacher Management</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 p-6">

<div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Teacher Management</h1>

    @if(session('success'))
        <div class="bg-green-100 text-green-700 p-2 mb-4 rounded">
            {{ session('success') }}
        </div>
    @endif

    <!-- Add Teacher -->
    <form method="POST" action="/teachers" class="bg-white p-4 rounded shadow mb-8">
        @csrf
        <h2 class="text-xl font-semibold mb-4">Add Teacher</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="name" placeholder="Teacher Name" class="border p-2 rounded" required>
            <input name="subject" placeholder="Subject" class="border p-2 rounded" required>
            <input name="email" type="email" placeholder="Email" class="border p-2 rounded" required>
        </div>

        <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Add Teacher
        </button>
    </form>

    <!-- Teacher List -->
    <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Teacher List</h2>

        <table class="w-full border">
            <thead>
                <tr class="border-b">
                    <th class="p-2 text-left">Name</th>
                    <th class="p-2 text-left">Subject</th>
                    <th class="p-2 text-left">Email</th>
                    <th class="p-2">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse($teachers as $teacher)
                    <tr class="border-b">
                        <td class="p-2">{{ $teacher->name }}</td>
                        <td class="p-2">{{ $teacher->subject }}</td>
                        <td class="p-2">{{ $teacher->email }}</td>
                        <td class="p-2">
                            <form method="POST" action="/teachers/{{ $teacher->id }}">
                                @csrf
                                @method('DELETE')
                                <button class="text-red-600">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="text-center p-4 text-gray-500">
                            No teachers found
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

</body>
</html>
