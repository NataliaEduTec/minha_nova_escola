<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alternatives;

class AlternativeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all alternatives
        $alternatives = Alternatives::all()->where('active', true);

        // Return a resource collection
        return response()->json($alternatives);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'description' => 'required|string',
            'question_id' => 'required|exists:questions,id',
            'is_correct' => 'boolean',
        ]);

        // Create a new alternative
        $alternative = Alternatives::create([
            ...$validated,
            'created_by_user' => auth()->id(),
        ]);

        // Return the created alternative
        return response()->json($alternative, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find the alternative by ID
        $alternative = Alternatives::findOrFail($id);

        // Return the alternative
        return response()->json($alternative);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Find the alternative by ID
        $alternative = Alternatives::findOrFail($id);

        // Validate the request
        $validated = $request->validate([
            'description' => 'sometimes|required|string',
            'created_by_user' => 'sometimes|required|exists:users,id',
            'question_id' => 'sometimes|required|exists:questions,id',
            'is_correct' => 'sometimes|boolean',
        ]);

        // Update the alternative
        $alternative->update($validated);

        // Return the updated alternative
        return response()->json($alternative);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find the alternative by ID
        $alternative = Alternatives::findOrFail($id);

        // Delete the alternative
        $alternative->delete();

        // Return a success message
        return response()->json(['message' => 'Alternative deleted successfully']);
    }
}
