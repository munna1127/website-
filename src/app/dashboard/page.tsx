"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setEmail("");
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin & Data Panel</h1>
            <p className="text-slate-400 text-sm mt-1">Live PostgreSQL Database Manager</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
              ← Back to Home
            </Button>
          </Link>
        </div>

        {/* Create Record Form */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Create New Entry</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Live database me naya record insert karo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Input
                type="email"
                required
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 whitespace-nowrap">
                {loading ? "Adding..." : "Add Record"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Database Records</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Total entries: {users.length}
              </CardDescription>
            </div>
            <Button onClick={fetchUsers} size="sm" variant="outline" className="border-slate-700 text-xs text-slate-300">
              ↻ Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {fetching ? (
              <p className="text-center py-8 text-slate-500 text-sm">Fetching live database...</p>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-sm">No records found. Add your first record above!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Role</th>
                      <th className="py-3 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-medium text-white">{u.name || "N/A"}</td>
                        <td className="py-3 px-4 text-slate-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-xs rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            onClick={() => handleDelete(u.id)}
                            size="sm"
                            variant="destructive"
                            className="text-xs bg-red-600/80 hover:bg-red-600"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
