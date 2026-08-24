"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [role, setRole] = useState("user");
  const [searchQuery, setSearchQuery] = useState("");
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
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setEmail("");
        setRole("user");
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

  // Real-time search filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  // Analytics Calculation
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              ⚡ Admin Central
            </h1>
            <p className="text-slate-400 text-sm mt-1">Live Database Metrics & Management Hub</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchUsers} variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
              ↻ Refresh Sync
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                ← Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Database Records</CardDescription>
              <CardTitle className="text-2xl font-bold text-white mt-1">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Admin Accounts</CardDescription>
              <CardTitle className="text-2xl font-bold text-indigo-400 mt-1">{adminCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Standard Users</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-400 mt-1">{userCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Engine Status</CardDescription>
              <CardTitle className="text-2xl font-bold text-teal-400 mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                Connected
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Create Record Form */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Create New Entry</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Live PostgreSQL database me record add karo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
              />
              <Input
                type="email"
                required
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/20">
                {loading ? "Adding..." : "+ Add Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Database Records Table with Live Search */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-white">All Records</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Showing {filteredUsers.length} of {users.length} entries
              </CardDescription>
            </div>
            
            {/* Live Search Input */}
            <div className="w-full sm:w-72">
              <Input
                placeholder="🔍 Search by name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white text-sm placeholder:text-slate-500"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {fetching ? (
              <div className="p-8 text-center text-slate-500 text-sm">Fetching live cloud records...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                {searchQuery ? "No matching records found for your search." : "No records yet. Add one using the form above."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400">
                      <th className="py-3.5 px-6 font-semibold">User</th>
                      <th className="py-3.5 px-6 font-semibold">Email</th>
                      <th className="py-3.5 px-6 font-semibold">Role</th>
                      <th className="py-3.5 px-6 font-semibold">Created</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-6 font-medium text-white">{u.name || "Anonymous"}</td>
                        <td className="py-3.5 px-6 text-slate-300 font-mono text-xs">{u.email}</td>
                        <td className="py-3.5 px-6">
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                            u.role === "admin"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : u.role === "editor"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <Button
                            onClick={() => handleDelete(u.id)}
                            size="sm"
                            variant="destructive"
                            className="text-xs bg-red-600/80 hover:bg-red-600 px-3 py-1 h-8"
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
