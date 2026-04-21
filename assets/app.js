"use strict";
function toISO(d) {
                return d.toISOString().slice(0, 10);
            }
            function addDays(d, n) {
                let x = new Date(d);
                x.setDate(x.getDate() + n);
                return x;
            }
            function isWeekend(d) {
                return d.getDay() == 0 || d.getDay() == 6;
            }

            function isValidDate(d) {
                return d instanceof Date && !isNaN(d.getTime());
            }

            function usHolidays(year) {
                function obs(d) {
                    let x = new Date(d.getTime());
                    if (x.getDay() == 6) x = addDays(x, -1);
                    if (x.getDay() == 0) x = addDays(x, 1);
                    return x;
                }
                let h = [];
                // New Year's Day - also check if Jan 1 falls on Saturday (observed Dec 31 prev year)
                let ny = obs(new Date(year, 0, 1));
                h.push(ny);
                // If Jan 1 is Saturday, observed is Dec 31 of previous year - add that too
                if (new Date(year, 0, 1).getDay() == 6)
                    h.push(new Date(year - 1, 11, 31));
                h.push(
                    new Date(
                        year,
                        0,
                        15 + ((1 - new Date(year, 0, 15).getDay() + 7) % 7),
                    ),
                ); // MLK Day
                h.push(
                    new Date(
                        year,
                        1,
                        15 + ((1 - new Date(year, 1, 15).getDay() + 7) % 7),
                    ),
                ); // Presidents Day
                h.push(
                    new Date(
                        year,
                        4,
                        31 - ((new Date(year, 4, 31).getDay() + 6) % 7),
                    ),
                ); // Memorial Day (last Mon May)
                if (year >= 2021) h.push(obs(new Date(year, 5, 19))); // Juneteenth
                h.push(obs(new Date(year, 6, 4))); // Independence Day
                h.push(
                    new Date(
                        year,
                        8,
                        1 + ((1 - new Date(year, 8, 1).getDay() + 7) % 7),
                    ),
                ); // Labor Day
                h.push(
                    new Date(
                        year,
                        9,
                        8 + ((1 - new Date(year, 9, 8).getDay() + 7) % 7),
                    ),
                ); // Columbus Day (2nd Mon Oct)
                h.push(obs(new Date(year, 10, 11))); // Veterans Day
                h.push(
                    new Date(
                        year,
                        10,
                        22 + ((4 - new Date(year, 10, 22).getDay() + 7) % 7),
                    ),
                ); // Thanksgiving
                h.push(obs(new Date(year, 11, 25))); // Christmas
                return h.map(toISO);
            }

            function buildHolidaySet(startDate, endDate) {
                // Generate holidays for every year in the range + buffer years
                let hol = new Set();
                let startYear = startDate.getFullYear() - 1;
                let endYear = endDate.getFullYear() + 1;
                for (let y = startYear; y <= endYear; y++) {
                    usHolidays(y).forEach((d) => hol.add(d));
                }
                return hol;
            }

            var MAX_DAYS = 10000;
            var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

            function calculate() {
                let include = document.getElementById("includeStart").checked;
                let rawCustom = document
                    .getElementById("customHolidays")
                    .value.split("\n")
                    .map((x) => x.trim())
                    .filter((x) => x);
                var customWarnings = [];
                let custom = new Set();
                rawCustom.forEach(function (entry) {
                    if (DATE_RE.test(entry) && isValidDate(new Date(entry + "T00:00:00"))) {
                        custom.add(entry);
                    } else {
                        customWarnings.push('Invalid format: "' + entry + '" (use YYYY-MM-DD)');
                    }
                });

                // Determine date range for holiday generation
                let mode = document.getElementById("mode").value;
                let resultEl = document.getElementById("result");
                var rangeStart, rangeEnd;

                if (mode === "add") {
                    var startInput = document.getElementById("startDate").value;
                    var daysInput = document.getElementById("daysToAdd").value;

                    // Validation: empty date
                    if (!startInput) {
                        resultEl.innerText = "Please enter a start date.";
                        return;
                    }
                    var s = new Date(startInput);
                    if (!isValidDate(s)) {
                        resultEl.innerText = "Invalid start date.";
                        return;
                    }

                    // Validation: empty days
                    if (daysInput.trim() === "") {
                        resultEl.innerText = "Please enter the number of business days.";
                        return;
                    }

                    var n = parseInt(daysInput, 10);

                    // Validation: non-numeric
                    if (isNaN(n)) {
                        resultEl.innerText = "Business days must be a number.";
                        return;
                    }

                    // Validation: negative
                    if (n < 0) {
                        resultEl.innerText = "Business days cannot be negative.";
                        return;
                    }

                    // Validation: zero
                    if (n === 0) {
                        resultEl.innerText = "Enter at least 1 business day.";
                        return;
                    }

                    // Validation: too large
                    if (n > MAX_DAYS) {
                        resultEl.innerText = "Maximum is " + MAX_DAYS.toLocaleString() + " business days.";
                        return;
                    }

                    rangeStart = s;
                    rangeEnd = addDays(rangeStart, Math.max(n * 2, 365));

                    let hol = buildHolidaySet(rangeStart, rangeEnd);
                    function isBiz(d) {
                        return (
                            !isWeekend(d) &&
                            !hol.has(toISO(d)) &&
                            !custom.has(toISO(d))
                        );
                    }

                    var cur = new Date(s);
                    var count = 0;

                    if (include && isBiz(cur)) {
                        // Start date counts as Day 1 — result should be start date when n=1
                        count = 1;
                        if (n > 1) cur = addDays(cur, 1); // advance only if we need more days
                    } else {
                        cur = addDays(cur, 1);
                    }

                    while (count < n) {
                        if (isBiz(cur)) count++;
                        if (count < n) cur = addDays(cur, 1);
                    }
                    while (!isBiz(cur)) cur = addDays(cur, 1);

                    var out = "Result date: " + toISO(cur);
                    if (customWarnings.length) out += "\n⚠ " + customWarnings.join("; ");
                    resultEl.innerText = out;

                } else {
                    var betweenStartInput = document.getElementById("betweenStart").value;
                    var betweenEndInput = document.getElementById("betweenEnd").value;

                    if (!betweenStartInput || !betweenEndInput) {
                        resultEl.innerText = "Please enter both start and end dates.";
                        return;
                    }

                    var a = new Date(betweenStartInput);
                    var b = new Date(betweenEndInput);

                    if (!isValidDate(a) || !isValidDate(b)) {
                        resultEl.innerText = "Invalid date(s). Please use valid dates.";
                        return;
                    }

                    if (b < a) {
                        var t = a;
                        a = b;
                        b = t;
                    }

                    rangeStart = a;
                    rangeEnd = b;

                    let hol = buildHolidaySet(rangeStart, rangeEnd);
                    function isBiz(d) {
                        return (
                            !isWeekend(d) &&
                            !hol.has(toISO(d)) &&
                            !custom.has(toISO(d))
                        );
                    }

                    var cur = new Date(a);
                    if (!include) cur = addDays(cur, 1);
                    var cnt = 0;
                    while (cur <= b) {
                        if (isBiz(cur)) cnt++;
                        cur = addDays(cur, 1);
                    }

                    var out = "Business days between: " + cnt;
                    if (customWarnings.length) out += "\n⚠ " + customWarnings.join("; ");
                    resultEl.innerText = out;
                }
            }

            function copyResult() {
                navigator.clipboard.writeText(
                    document.getElementById("result").innerText,
                );
            }

            document.getElementById("mode").addEventListener("change", (e) => {
                document.getElementById("addMode").style.display =
                    e.target.value == "add" ? "block" : "none";
                document.getElementById("betweenMode").style.display =
                    e.target.value == "between" ? "block" : "none";
            });

            document.getElementById("year").textContent =
                new Date().getFullYear();
