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

interface MessageItem {
  id: string;
  name: string;
  contact: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [userRes, msgRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/contact"),
      ]);
      const userData = await userRes.json();
      const msgData = await msgRes.json();

      if (userData.success) setUsers(userData.users);
      if (msgData.success) setMessages(msgData.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">⚡ Admin Central</h1>
            <p className="text-slate-400 text-sm mt-1">Live Database Metrics & Inbox</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchData} variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
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
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Total Users</CardDescription>
              <CardTitle className="text-2xl font-bold text-white mt-1">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Incoming Messages</CardDescription>
              <CardTitle className="text-2xl font-bold text-indigo-400 mt-1">{messages.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Admins / Staff</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-400 mt-1">
                {users.filter((u) => u.role === "admin").length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Engine Status</CardDescription>
              <CardTitle className="text-2xl font-bold text-teal-400 mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                Connected
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Inbox Section (Incoming Transmissions) */}
        <Card className="bg-slate-900/60 border-indigo-500/30 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-800/60 bg-indigo-950/20">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              📬 Contact Transmissions ({messages.length})
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Live contact form se aane wale messages direct database se fetch ho rahe hain.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">Inbox empty. No contact messages received yet.</div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4 sm:p-6 hover:bg-slate-800/20 transition space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{msg.name}</span>
                        <span className="text-xs text-indigo-400 font-mono">({msg.contact})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                        <Button
                          onClick={() => handleDeleteMessage(msg.id)}
                          size="sm"
                          variant="destructive"
                          className="text-xs h-7 px-2.5 bg-red-600/80 hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-indigo-300">Subject: {msg.subject}</p>
                    <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded border border-slate-800/80 leading-relaxed font-sans">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
              />
              <Input
                type="email"
                required
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
                {loading ? "Adding..." : "+ Add Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Database Records Table */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-white">All User Records</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Showing {filteredUsers.length} of {users.length} entries
              </CardDescription>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="🔍 Search users..."
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
              <div className="p-8 text-center text-slate-500 text-sm">No records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400">
                      <th className="py-3.5 px-6 font-semibold">User</th>
                      <th className="py-3.5 px-6 font-semibold">Email</th>
                      <th className="py-3.5 px-6 font-semibold">Role</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-6 font-medium text-white">{u.name || "Anonymous"}</td>
                        <td className="py-3.5 px-6 text-slate-300 font-mono text-xs">{u.email}</td>
                        <td className="py-3.5 px-6">
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <Button
                            onClick={() => handleDeleteUser(u.id)}
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
