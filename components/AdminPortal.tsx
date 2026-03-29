"use client";

import { useState, useTransition } from "react";

import { AdminUser } from "@/lib/admin";

type AdminPortalProps = {
  currentUserId: string;
  users: AdminUser[];
};

export function AdminPortal({ currentUserId, users }: AdminPortalProps) {
  const [localUsers, setLocalUsers] = useState(users);
  const [pendingUserId, startUserTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <section id="admin-controls" className="section">
        <div className="section__heading">
          <p className="eyebrow">League Admin</p>
          <h2>Control users and resets</h2>
        </div>
        <p className="section__copy">
          Use this admin portal to manage admin access, reset account picks, and remove users when needed.
        </p>
        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </section>

      <section id="admin-users" className="section">
        <div className="section__heading">
          <p className="eyebrow">User Control</p>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Match Picks</th>
                <th>Tournament Picks</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {localUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Yes" : "No"}</td>
                  <td>{user.matchPickCount}</td>
                  <td>{user.tournamentReady ? "Ready" : "Incomplete"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      {user.id === currentUserId ? (
                        <span>Current admin</span>
                      ) : (
                        <button
                          className="ghost-button"
                          type="button"
                          disabled={pendingUserId}
                          onClick={() => {
                            startUserTransition(async () => {
                              setError(null);
                              setMessage(null);

                              const response = await fetch(`/api/admin/users/${user.id}`, {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ isAdmin: !user.isAdmin })
                              });

                              const result = (await response.json()) as { error?: string };

                              if (!response.ok) {
                                setError(result.error || "Could not update this user.");
                                return;
                              }

                              setLocalUsers((current) =>
                                current.map((entry) =>
                                  entry.id === user.id ? { ...entry, isAdmin: !entry.isAdmin } : entry
                                )
                              );
                              setMessage(`${user.displayName} admin access updated.`);
                            });
                          }}
                        >
                          {user.isAdmin ? "Remove admin" : "Make admin"}
                        </button>
                      )}
                      <button
                        className="ghost-button"
                        type="button"
                        disabled={pendingUserId}
                        onClick={() => {
                          startUserTransition(async () => {
                            setError(null);
                            setMessage(null);

                            const response = await fetch(`/api/admin/users/${user.id}/reset`, {
                              method: "POST"
                            });

                            const result = (await response.json()) as { error?: string };

                            if (!response.ok) {
                              setError(result.error || "Could not reset this account.");
                              return;
                            }

                            setLocalUsers((current) =>
                              current.map((entry) =>
                                entry.id === user.id
                                  ? {
                                      ...entry,
                                      matchPickCount: 0,
                                      tournamentReady: false
                                    }
                                  : entry
                              )
                            );
                            setMessage(`${user.displayName} account picks reset.`);
                          });
                        }}
                      >
                        Reset account
                      </button>
                      {user.id === currentUserId ? null : (
                        <button
                          className="ghost-button"
                          type="button"
                          disabled={pendingUserId}
                          onClick={() => {
                            startUserTransition(async () => {
                              setError(null);
                              setMessage(null);

                              const response = await fetch(`/api/admin/users/${user.id}/remove`, {
                                method: "POST"
                              });

                              const result = (await response.json()) as { error?: string };

                              if (!response.ok) {
                                setError(result.error || "Could not remove this user.");
                                return;
                              }

                              setLocalUsers((current) => current.filter((entry) => entry.id !== user.id));
                              setMessage(`${user.displayName} was removed.`);
                            });
                          }}
                        >
                          Remove user
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a className="section__jump" href="#top">
          Back to top
        </a>
      </section>
    </>
  );
}
