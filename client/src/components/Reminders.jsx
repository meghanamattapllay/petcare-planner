import React, { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, Filter, RotateCcw, Search } from "lucide-react";

const API = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.origin.includes(":5173") ? "http://localhost:5000/api" : "/api");

const Reminders = ({ pets = null, user = null }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [careType, setCareType] = useState("All");
    const [status, setStatus] = useState("All");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        const loadReminders = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API}/care-records/upcoming`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Unable to load reminders.");
                }

                const data = await response.json();
                setRecords(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadReminders();
    }, []);

    const careTypes = [
        "All",
        "Vaccination",
        "Grooming",
        "Appointment",
        "Medication",
        "Other",
    ];

    const myRecords = useMemo(() => {
        if (!records || !records.length) return [];
        if (user?.role === "admin") return records;
        if (pets !== null) {
            if (pets.length === 0) return [];
            const petIdSet = new Set(pets.map((p) => String(p._id)));
            return records.filter((r) => {
                const pid = String(r.petId?._id || r.petId || r.pet?._id || r.pet);
                return petIdSet.has(pid);
            });
        }
        return records;
    }, [records, pets, user]);

    const upcomingCount = useMemo(
        () => myRecords.filter((r) => (r.status || "").toLowerCase() === "upcoming").length,
        [myRecords]
    );

    const overdueCount = useMemo(
        () => myRecords.filter((r) => (r.status || "").toLowerCase() === "overdue").length,
        [myRecords]
    );

    const filteredRecords = useMemo(() => {
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        return myRecords.filter((record) => {
            const petName = record.petId?.name || record.pet?.name || "";
            const title = record.title || "";
            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                title.toLowerCase().includes(searchText) ||
                petName.toLowerCase().includes(searchText);

            const matchesCareType =
                careType === "All" || record.careType === careType;

            const dueDate = record.nextDueDate
                ? new Date(record.nextDueDate).toISOString().slice(0, 10)
                : "";

            const matchesStatus =
                status === "All" ||
                record.status?.toLowerCase() === status.toLowerCase();

            const matchesDate = !dateFilter || dueDate === dateFilter;

            return matchesSearch && matchesCareType && matchesStatus && matchesDate;
        });
    }, [myRecords, search, careType, status, dateFilter]);

    const isFiltered = Boolean(
        search || careType !== "All" || status !== "All" || dateFilter
    );

    const resetFilters = () => {
        setSearch("");
        setCareType("All");
        setStatus("All");
        setDateFilter("");
    };

    if (loading) {
        return (
            <div className="empty compact">
                <CalendarDays size={28} />
                <p>Loading care reminders...</p>
            </div>
        );
    }

    return (
        <section className="reminders-page">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">STAY ON TOP OF THEIR CARE</span>
                    <h2>Care reminders</h2>
                </div>
            </div>

            {/* Interactive Stat Cards for Filtering */}
            <div className="reminders-stat-grid">
                <button
                    type="button"
                    className={`reminders-stat-card green ${status === "upcoming" ? "active" : ""}`}
                    onClick={() => setStatus(status === "upcoming" ? "All" : "upcoming")}
                    title="Click to filter by upcoming care"
                >
                    <div className="stat-icon">
                        <CalendarDays size={24} />
                    </div>
                    <div className="stat-text">
                        <strong>{upcomingCount}</strong>
                        <span>Upcoming care</span>
                    </div>
                    <span className="stat-pill-label">
                        {status === "upcoming" ? "Filtered" : "Filter"}
                    </span>
                </button>

                <button
                    type="button"
                    className={`reminders-stat-card rose ${status === "overdue" ? "active" : ""}`}
                    onClick={() => setStatus(status === "overdue" ? "All" : "overdue")}
                    title="Click to filter by overdue care"
                >
                    <div className="stat-icon">
                        <Bell size={24} />
                    </div>
                    <div className="stat-text">
                        <strong>{overdueCount}</strong>
                        <span>Overdue care</span>
                    </div>
                    <span className="stat-pill-label">
                        {status === "overdue" ? "Filtered" : "Filter"}
                    </span>
                </button>
            </div>

            {/* Modern Clean Filter Toolbar */}
            <div className="reminders-filters">
                <div className="search">
                    <Search size={17} />
                    <input
                        placeholder="Search pet or care title..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <select
                        className="filter-select"
                        value={careType}
                        onChange={(event) => setCareType(event.target.value)}
                        title="Filter by care type"
                    >
                        {careTypes.map((type) => (
                            <option key={type} value={type}>
                                {type === "All" ? "All care types" : type}
                            </option>
                        ))}
                    </select>

                    <select
                        className="filter-select"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        title="Filter by status"
                    >
                        <option value="All">All statuses</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    <input
                        className="filter-date"
                        type="date"
                        value={dateFilter}
                        onChange={(event) => setDateFilter(event.target.value)}
                        title="Filter by specific date"
                    />

                    {isFiltered && (
                        <button
                            type="button"
                            className="filter-reset-btn"
                            onClick={resetFilters}
                            title="Reset all filters"
                        >
                            <RotateCcw size={13} /> Reset
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            {/* Polished Reminders Card List */}
            <div className="reminder-list">
                {filteredRecords.map((record) => {
                    const dueDateObj = record.nextDueDate ? new Date(record.nextDueDate) : null;
                    const isValidDate = dueDateObj && !isNaN(dueDateObj.getTime());
                    const statusClass = record.status || "upcoming";

                    return (
                        <article className="reminder" key={record._id}>
                            <div className={`reminder-date ${statusClass}`}>
                                <strong>{isValidDate ? dueDateObj.getDate() : "--"}</strong>
                                <small>
                                    {isValidDate
                                        ? dueDateObj.toLocaleString("en", { month: "short" })
                                        : "Due"}
                                </small>
                            </div>

                            <div className="reminder-content">
                                <div className="reminder-header-row">
                                    <strong>{record.title}</strong>
                                    <span className="reminder-type-badge">
                                        {record.careType}
                                    </span>
                                </div>
                                <div className="reminder-pet-info">
                                    <span>🐾 {record.petId?.name || "Your pet"}</span>
                                    {record.notes && (
                                        <span className="reminder-notes-snippet">
                                            • {record.notes}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <span className={`pill ${statusClass}`}>
                                {statusClass}
                            </span>
                        </article>
                    );
                })}

                {!error && filteredRecords.length === 0 && (
                    <div className="empty compact">
                        <Bell size={28} />
                        <h3>No reminders found</h3>
                        <p>
                            {isFiltered
                                ? "No care events match the current search or filters."
                                : (pets && pets.length === 0) ? "You have no pets added yet. Add a pet to track care schedules." : "No upcoming or overdue care recorded yet."}
                        </p>
                        {isFiltered && (
                            <button
                                type="button"
                                className="filter-reset-btn"
                                style={{ margin: "14px auto 0" }}
                                onClick={resetFilters}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Reminders;
