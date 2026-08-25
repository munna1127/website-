"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

      // If unauthorized, kick directly to /login
      if (userRes.status === 401 || msgRes.status === 401) {
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }

      const userData = await userRes.json();
      const msgData = await msgRes.json();

      if (userData.success) setUsers(userData.users);
      if (msgData.success) setMessages(msgData.messages);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      router.replace("/login");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };

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

  const exportCSV = () => {
    if (messages.length === 0) return alert("No messages to export!");
    const headers = ["ID,Name,Contact,Subject,Message,CreatedAt"];
    const rows = messages.map(
      (m) =>
        `"${m.id}","${m.name}","${m.contact}","${m.subject}","${m.message.replace(/"/g, '""')}","${m.createdAt}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `messages_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (fetching && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono">Verifying authorization credentials...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              ⚡ Admin Central
            </h1>
            <p className="text-slate-400 text-sm mt-1">Live Database Metrics & Protected Inbox</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button onClick={fetchData} variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
              ↻ Refresh Sync
            </Button>
            <Button onClick={exportCSV} variant="outline" size="sm" className="border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300">
              📥 Export CSV
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                Home
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive" size="sm" className="bg-red-600/80 hover:bg-red-600">
              Logout
            </Button>
          </div>
        </div>

        {/* Real-time KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Total Users</CardDescription>
              <CardTitle className="text-2xl font-bold text-white mt-1">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Incoming Transmissions</CardDescription>
              <CardTitle className="text-2xl font-bold text-indigo-400 mt-1">{messages.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Admin Accounts</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-400 mt-1">
                {users.filter((u) => u.role === "admin").length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase">Session Status</CardDescription>
              <CardTitle className="text-2xl font-bold text-teal-400 mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                Authorized
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Protected Transmissions Inbox */}
        <Card className="bg-slate-900/60 border-indigo-500/30 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-800/60 bg-indigo-950/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                📬 Contact Transmissions ({messages.length})
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Real-time synchronized transmission data stored in Neon PostgreSQL.
              </CardDescription>
            </div>
            <Button onClick={exportCSV} size="sm" variant="outline" className="text-xs border-indigo-500/30 text-indigo-300">
              Download CSV
            </Button>
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
