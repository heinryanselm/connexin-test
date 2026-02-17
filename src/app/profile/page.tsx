"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

interface Profile {
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  joinedDate: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = getToken();

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          removeToken();
          router.replace("/");
          return;
        }

        const data: Profile = await res.json();
        setProfile(data);
      } catch {
        removeToken();
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  function handleLogout() {
    removeToken();
    router.push("/");
  }

  if (isLoading) {
    return (
      <main className="page-center">
        <p className="loading">Loading profile&hellip;</p>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="page-center">
      <div className="card profile-card">
        <div className="profile-header">
          <div className="avatar" aria-hidden="true">
            {profile.name.charAt(0)}
          </div>
          <h1>{profile.name}</h1>
          <p className="profile-role">{profile.role}</p>
          <div className="status-badge">
            <span className="status-dot" aria-hidden="true" />
            Active
          </div>
        </div>

        <hr className="divider" />

        <dl className="profile-details">
          <div className="detail-row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Department</dt>
            <dd>{profile.department}</dd>
          </div>
          <div className="detail-row">
            <dt>Location</dt>
            <dd>{profile.location}</dd>
          </div>
          <div className="detail-row">
            <dt>Member since</dt>
            <dd>{formatDate(profile.joinedDate)}</dd>
          </div>
        </dl>

        <button onClick={handleLogout} className="btn-outline">
          Sign Out
        </button>
      </div>
    </main>
  );
}
