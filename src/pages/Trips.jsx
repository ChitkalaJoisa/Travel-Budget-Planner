
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Globe, X } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ dest: '', date: '', budget: '' });

  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: ''
  });

  // ✅ FETCH TRIPS
  const fetchTrips = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/trips/");
    const data = await res.json();
    setTrips(data);
  };

  // ✅ FETCH EXPENSES BY TRIP
  const fetchExpenses = async (tripId) => {
    const res = await fetch(`http://127.0.0.1:8000/api/expenses/?trip=${tripId}`);
    const data = await res.json();
    setExpenses(data);
  };

  // ✅ ADD TRIP
  const addTrip = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/api/trips/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.dest,
        budget: parseFloat(form.budget),
        user: 1
      }),
    });

    fetchTrips();
    setIsModalOpen(false);
    setForm({ dest: '', date: '', budget: '' });
  };

  // ✅ ADD EXPENSE
  const addExpense = async (e) => {
    e.preventDefault();

    if (!selectedTrip) {
      alert("Select a trip first");
      return;
    }

    await fetch("http://127.0.0.1:8000/api/expenses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        trip: selectedTrip.id
      }),
    });

    fetchExpenses(selectedTrip.id);
    setExpenseForm({ category: '', amount: '' });
  };

  // ✅ LOAD TRIPS
  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 pt-32 animate-fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900">Journeys</h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black"
        >
          <Plus size={20} /> New Trip
        </button>
      </div>

      {/* TRIPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div 
            key={trip.id}
            className="bento-card cursor-pointer"
            onClick={() => {
              setSelectedTrip(trip);
              fetchExpenses(trip.id);
            }}
          >
            <div className="mb-4">
              <Globe size={28} />
            </div>

            <h3 className="text-xl font-bold">{trip.name}</h3>

            <p className="text-sm text-gray-500">
              <Calendar size={14} /> {trip.date || "No Date"}
            </p>

            <p className="mt-4 font-bold text-blue-600">
              ₹{trip.budget}
            </p>
          </div>
        ))}
      </div>

      {/* EXPENSES DISPLAY */}
      {selectedTrip && (
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Expenses for {selectedTrip.name}
          </h2>

          {expenses.length === 0 ? (
            <p>No expenses yet</p>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="border p-3 rounded mb-2">
                {exp.category} - ₹{exp.amount}
              </div>
            ))
          )}

          {/* ADD EXPENSE FORM */}
          <form onSubmit={addExpense} className="mt-6 flex gap-4">

            <input
              required
              placeholder="Category"
              className="input-glass"
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, category: e.target.value })
              }
            />

            <input
              required
              type="number"
              placeholder="Amount"
              className="input-glass"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, amount: e.target.value })
              }
            />

            <button className="bg-blue-600 text-white px-6 rounded-xl">
              Add
            </button>

          </form>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">

          <div className="bg-white p-6 rounded-xl w-96">

            <button onClick={() => setIsModalOpen(false)}>
              <X />
            </button>

            <h3 className="text-xl font-bold mb-4">Add Trip</h3>

            <form onSubmit={addTrip} className="space-y-4">

              <input
                required
                placeholder="Destination"
                className="input-glass"
                value={form.dest}
                onChange={(e) => setForm({ ...form, dest: e.target.value })}
              />

              <input
                type="date"
                className="input-glass"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                required
                type="number"
                placeholder="Budget"
                className="input-glass"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />

              <button className="w-full bg-black text-white py-3 rounded">
                Save
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
