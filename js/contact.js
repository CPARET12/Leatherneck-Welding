// js/contact.js
(function () {
  const LS_KEY = "LW_APPOINTMENTS_V1";

  // ---- Config you can tweak ----
  const CONFIG = {
    timeZone: "local",
    businessDays: [1, 2, 3, 4, 5], // Mon-Fri (0=Sun)
    dayStart: "08:00",
    dayEnd: "17:00",
    slotStepMinutes: 15,
    durations: {
      phone: 15,
      onsite: 60 // set to 30 if you want; or add a dropdown later
    },
    minNoticeMinutes: 60 // block times within the next hour
  };

  // ---- DOM ----
  const dateEl = document.getElementById("schedDate");
  const slotsEl = document.getElementById("timeSlots");
  const typeEl = document.getElementById("eventType");
  const typeHint = document.getElementById("typeHint");
  const openBtn = document.getElementById("openDetails");
  const msgEl = document.getElementById("schedMsg");

  const backdrop = document.getElementById("modalBackdrop");
  const modal = document.getElementById("detailsModal");
  const modalSummary = document.getElementById("modalSummary");
  const closeModalBtn = document.getElementById("closeModal");
  const cancelBookingBtn = document.getElementById("cancelBooking");
  const form = document.getElementById("detailsForm");
  const confirmMsg = document.getElementById("confirmMsg");

  const addressWrap = document.getElementById("addressWrap");
  const addressEl = document.getElementById("address");

  // Form fields
  const f = {
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    service: document.getElementById("service"),
    dimensions: document.getElementById("dimensions"),
    timeline: document.getElementById("timeline"),
    notes: document.getElementById("notes")
  };

  // ---- State ----
  let selectedTime = null; // "HH:MM"
  let selectedType = "";
  let selectedDate = ""; // "YYYY-MM-DD"

  // ---- Helpers ----

    // Date helpers for "block today + next day" and skip weekends
  function toYMD(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  function isWeekend(d) {
    const day = d.getDay(); // 0 Sun, 6 Sat
    return day === 0 || day === 6;
  }

  function nextBusinessDay(d) {
    let x = new Date(d);
    while (isWeekend(x)) x = addDays(x, 1);
    return x;
  }

  // Earliest date: block today + next day, then push off Sat/Sun
  function earliestSelectableDate() {
    const today = new Date();
    let candidate = addDays(today, 2);  // today + 2 days (blocks today + tomorrow)
    candidate = nextBusinessDay(candidate);
    return candidate;
  }




  function parseHHMM(str) {
    const [h, m] = str.split(":").map(Number);
    return { h, m };
  }

  function toMinutes(hhmm) {
    const { h, m } = parseHHMM(hhmm);
    return h * 60 + m;
  }

  function minutesToHHMM(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function isBusinessDay(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const day = d.getDay();
    return CONFIG.businessDays.includes(day);
  }

  function nowPlusNoticeISO() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + CONFIG.minNoticeMinutes);
    return now;
  }

  function combineDateTime(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`);
  }

  function getAppointments() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAppointments(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  function slotIsAvailable(dateStr, timeStr, durationMin) {
    const appts = getAppointments();
    const start = combineDateTime(dateStr, timeStr).getTime();
    const end = start + durationMin * 60_000;

    // Block too-soon slots
    if (combineDateTime(dateStr, timeStr) < nowPlusNoticeISO()) return false;

    // Block any overlapping appointment
    for (const a of appts) {
      if (a.date !== dateStr) continue;
      const aStart = combineDateTime(a.date, a.time).getTime();
      const aEnd = aStart + a.durationMin * 60_000;
      if (overlaps(start, end, aStart, aEnd)) return false;
    }
    return true;
  }

  function clearMsg() { msgEl.textContent = ""; }
  function setMsg(t) { msgEl.textContent = t; }

  function renderSlots() {
    slotsEl.innerHTML = "";
    selectedTime = null;
    openBtn.disabled = true;

    if (!selectedDate) {
      slotsEl.innerHTML = `<div class="slots__empty">Choose a date to see times.</div>`;
      return;
    }

    if (!isBusinessDay(selectedDate)) {
      slotsEl.innerHTML = `<div class="slots__empty">No availability on weekends. Please choose a weekday.</div>`;
      return;
    }

    // We show slots based on 15-min grid. Availability depends on selected type duration.
    const duration = selectedType ? CONFIG.durations[selectedType] : CONFIG.slotStepMinutes;

    const startMin = toMinutes(CONFIG.dayStart);
    const endMin = toMinutes(CONFIG.dayEnd);

    let any = false;

    for (let t = startMin; t + duration <= endMin; t += CONFIG.slotStepMinutes) {
      const timeStr = minutesToHHMM(t);
      const ok = slotIsAvailable(selectedDate, timeStr, duration);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot";
      btn.textContent = timeStr;
      btn.disabled = !ok;
      btn.setAttribute("aria-pressed", "false");

      btn.addEventListener("click", () => {
        // Unselect any previous
        [...slotsEl.querySelectorAll(".slot")].forEach(b => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        selectedTime = timeStr;

        // Require event type too
        openBtn.disabled = !(selectedDate && selectedTime && selectedType);
        clearMsg();
      });

      slotsEl.appendChild(btn);
      if (ok) any = true;
    }

    if (!any) {
      slotsEl.innerHTML = `<div class="slots__empty">No open times for this date. Try another day.</div>`;
    }
  }

  function setTypeUI() {
    selectedType = typeEl.value || "";
    if (!selectedType) {
      typeHint.textContent = "";
      openBtn.disabled = true;
      renderSlots(); // rerender (shows 15-min grid fallback)
      return;
    }

    const d = CONFIG.durations[selectedType];
    typeHint.textContent = selectedType === "phone"
      ? `Phone calls are ${d} minutes.`
      : `On-site quotes are ${d} minutes (default).`;

    // Address required for onsite
    if (selectedType === "onsite") {
      addressWrap.style.display = "";
      addressEl.setAttribute("required", "true");
    } else {
      addressWrap.style.display = "none";
      addressEl.removeAttribute("required");
      addressEl.value = "";
    }

    // Re-render slots based on duration. If a time was selected, user should reselect.
    renderSlots();
    clearMsg();
  }

  function openModal() {
    if (!(selectedDate && selectedTime && selectedType)) return;

    // Final availability check (in case something changed)
    const duration = CONFIG.durations[selectedType];
    if (!slotIsAvailable(selectedDate, selectedTime, duration)) {
      setMsg("That time is no longer available. Please select another time.");
      renderSlots();
      return;
    }

    const label = selectedType === "phone" ? "Phone Call" : "On-Site Quote";
    modalSummary.textContent = `${label} — ${selectedDate} at ${selectedTime} (${duration} min)`;

    confirmMsg.hidden = true;
    confirmMsg.textContent = "";

    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function setErr(id, msg) {
    const el = form.querySelector(`[data-err="${id}"]`);
    if (el) el.textContent = msg || "";
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validateForm() {
    let ok = true;
    Object.keys(f).forEach(k => setErr(k, ""));
    setErr("address", "");

    if (!f.fullName.value.trim()) { setErr("fullName", "Required."); ok = false; }
    if (!f.phone.value.trim()) { setErr("phone", "Required."); ok = false; }
    if (!f.email.value.trim()) { setErr("email", "Required."); ok = false; }
    else if (!validEmail(f.email.value.trim())) { setErr("email", "Enter a valid email."); ok = false; }

    if (!f.service.value.trim()) { setErr("service", "Required."); ok = false; }
    if (!f.dimensions.value.trim()) { setErr("dimensions", "Required."); ok = false; }
    if (!f.timeline.value.trim()) { setErr("timeline", "Required."); ok = false; }
    if (!f.notes.value.trim()) { setErr("notes", "Required."); ok = false; }

    if (selectedType === "onsite") {
      if (!addressEl.value.trim()) { setErr("address", "Address required for on-site quotes."); ok = false; }
    }

    return ok;
  }

  function bookAppointment() {
    const durationMin = CONFIG.durations[selectedType];

    // Re-check slot availability
    if (!slotIsAvailable(selectedDate, selectedTime, durationMin)) {
      closeModal();
      setMsg("That time is no longer available. Please pick another slot.");
      renderSlots();
      return;
    }

    const appts = getAppointments();
    const id = `apt_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    appts.push({
      id,
      type: selectedType,
      date: selectedDate,
      time: selectedTime,
      durationMin,
      status: "new",
      createdAt: new Date().toISOString(),
      customer: {
        name: f.fullName.value.trim(),
        phone: f.phone.value.trim(),
        email: f.email.value.trim()
      },
      job: {
        service: f.service.value.trim(),
        address: addressEl.value.trim(),
        dimensions: f.dimensions.value.trim(),
        timeline: f.timeline.value.trim(),
        notes: f.notes.value.trim()
      }
    });

    saveAppointments(appts);

    confirmMsg.hidden = false;
    confirmMsg.textContent = "✅ Scheduled! We’ll follow up to confirm details.";
    form.reset();

    // Keep modal open for a second, then close and refresh slots
    setTimeout(() => {
      closeModal();
      setMsg("Appointment scheduled. You’ll be contacted to confirm.");
      renderSlots();
      openBtn.disabled = true;
      selectedTime = null;
      typeEl.value = "";
      selectedType = "";
      typeHint.textContent = "";
    }, 900);
  }

    // ---- Events ----
  // Date: block today + next day, skip Sat/Sun
  const minDate = earliestSelectableDate();
  dateEl.min = toYMD(minDate);

  // Optional: auto-set the picker to the earliest allowed date on load:
  // dateEl.value = toYMD(minDate);
  // selectedDate = dateEl.value;
  // slotsEl.innerHTML = `<div class="slots__empty">Choose an appointment type first.</div>`;


  dateEl.addEventListener("change", () => {
  clearMsg();

  const minAllowed = earliestSelectableDate();
  const raw = dateEl.value || "";

  if (raw) {
    const chosen = new Date(raw + "T00:00:00");
    if (chosen < minAllowed) {
      dateEl.value = toYMD(minAllowed);
    }
  }

  selectedDate = dateEl.value || "";

  if (!selectedType) {
    slotsEl.innerHTML = `<div class="slots__empty">Choose an appointment type first.</div>`;
    openBtn.disabled = true;
    return;
  }

  renderSlots();
  openBtn.disabled = !(selectedDate && selectedTime && selectedType);
});



  typeEl.addEventListener("change", () => {
    setTypeUI();
    openBtn.disabled = !(selectedDate && selectedTime && selectedType);

    if (!selectedDate) {
  slotsEl.innerHTML = `<div class="slots__empty">Choose a date to see times.</div>`;
}
  });

  openBtn.addEventListener("click", () => {
    if (!selectedType) {
      setMsg("Please choose an appointment type.");
      return;
    }
    if (!selectedTime) {
      setMsg("Please choose a time slot.");
      return;
    }
    openModal();
  });

  closeModalBtn.addEventListener("click", closeModal);
  cancelBookingBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    bookAppointment();
  });

  // Initial UI
  addressWrap.style.display = "none";
})();
