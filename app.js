const workspace = document.querySelector("#workspace");
const toggleRail = document.querySelector("#toggleRail");
const sectionTitle = document.querySelector("#sectionTitle");
const navButtons = document.querySelectorAll(".nav-icon[data-section]");
const viewSections = document.querySelectorAll(".view-section[data-view]");
const bankBalanceInput = document.querySelector("#bankBalanceInput");
const bankBalanceDisplay = document.querySelector("#bankBalanceDisplay");
const saveBankBalance = document.querySelector("#saveBankBalance");
const cashFlowPie = document.querySelector("#cashFlowPie");
const cashFlowPercent = document.querySelector("#cashFlowPercent");
const expenseNameInput = document.querySelector("#expenseNameInput");
const expenseAmountInput = document.querySelector("#expenseAmountInput");
const incomeTotal = document.querySelector("#incomeTotal");
const expenseTotal = document.querySelector("#expenseTotal");
const expenseDisplay = document.querySelector("#expenseDisplay");
const expenseList = document.querySelector("#expenseList");
const flowResult = document.querySelector("#flowResult");
const addExpense = document.querySelector("#addExpense");
const needsAmount = document.querySelector("#needsAmount");
const wantsAmount = document.querySelector("#wantsAmount");
const savingsAmount = document.querySelector("#savingsAmount");
const workTaskName = document.querySelector("#workTaskName");
const workTaskDefinition = document.querySelector("#workTaskDefinition");
const workTaskPriority = document.querySelector("#workTaskPriority");
const workTaskDue = document.querySelector("#workTaskDue");
const addWorkTask = document.querySelector("#addWorkTask");
const workTaskList = document.querySelector("#workTaskList");
const workPriorityTitle = document.querySelector("#workPriorityTitle");
const workPriorityDescription = document.querySelector("#workPriorityDescription");
const workPriorityStack = document.querySelector("#workPriorityStack");
const habitName = document.querySelector("#habitName");
const habitIdentity = document.querySelector("#habitIdentity");
const habitCue = document.querySelector("#habitCue");
const habitAction = document.querySelector("#habitAction");
const habitReward = document.querySelector("#habitReward");
const habitCategory = document.querySelector("#habitCategory");
const addHabit = document.querySelector("#addHabit");
const habitList = document.querySelector("#habitList");
const habitSummaryBadge = document.querySelector("#habitSummaryBadge");
const habitSummaryTitle = document.querySelector("#habitSummaryTitle");
const habitSummaryDescription = document.querySelector("#habitSummaryDescription");
const habitSummaryStack = document.querySelector("#habitSummaryStack");
const habitDoneCount = document.querySelector("#habitDoneCount");
const habitCoachNote = document.querySelector("#habitCoachNote");
const journalEnergy = document.querySelector("#journalEnergy");
const journalProgress = document.querySelector("#journalProgress");
const journalLesson = document.querySelector("#journalLesson");
const saveJournalEntry = document.querySelector("#saveJournalEntry");
const journalList = document.querySelector("#journalList");
const dailyDate = document.querySelector("#dailyDate");
const dailyClock = document.querySelector("#dailyClock");
const dailyTaskText = document.querySelector("#dailyTaskText");
const addDailyTask = document.querySelector("#addDailyTask");
const dailyTaskList = document.querySelector("#dailyTaskList");

const storageKeys = {
  bankBalance: "organizacion.finance.bankBalance",
  expenses: "organizacion.finance.expenses",
  workTasks: "organizacion.work.tasks",
  habits: "organizacion.life.habits",
  journal: "organizacion.life.journal",
  dailyPrefix: "organizacion.daily.",
};

const sectionNames = {
  finance: "Finanzas",
  work: "Trabajo",
  life: "Vida",
  calendar: "Calendario",
  fitness: "Fitness",
};

const moneyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("es-CL", {
  hour: "2-digit",
  minute: "2-digit",
});

toggleRail.addEventListener("click", () => {
  workspace.classList.toggle("rail-collapsed");
});

function switchSection(sectionName) {
  const targetView = document.querySelector(`[data-view="${sectionName}"]`);

  if (!targetView) {
    return;
  }

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === sectionName);
  });

  viewSections.forEach((section) => {
    section.classList.toggle("is-active", section.dataset.view === sectionName);
  });

  sectionTitle.textContent = sectionNames[sectionName] || "Organizacion";
}

function normalizeMoney(value) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.round(parsedValue);
}

function renderBankBalance(value) {
  const cleanValue = normalizeMoney(value);
  bankBalanceDisplay.textContent = moneyFormatter.format(cleanValue);
  bankBalanceInput.value = cleanValue > 0 ? cleanValue : "";
  renderBudgetRule(cleanValue);
}

function saveCurrentBankBalance() {
  const cleanValue = normalizeMoney(bankBalanceInput.value);
  localStorage.setItem(storageKeys.bankBalance, String(cleanValue));
  renderBankBalance(cleanValue);
  renderCashFlowFromStorage();
}

function renderBudgetRule(value) {
  const income = normalizeMoney(value);
  needsAmount.textContent = moneyFormatter.format(Math.round(income * 0.5));
  wantsAmount.textContent = moneyFormatter.format(Math.round(income * 0.3));
  savingsAmount.textContent = moneyFormatter.format(Math.round(income * 0.2));
}

function readExpenses() {
  try {
    const savedExpenses = JSON.parse(localStorage.getItem(storageKeys.expenses) || "[]");
    return Array.isArray(savedExpenses) ? savedExpenses : [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(storageKeys.expenses, JSON.stringify(expenses));
}

function getExpenseTotal() {
  return readExpenses().reduce((total, expense) => total + normalizeMoney(expense.amount), 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readWorkTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKeys.workTasks) || "[]");
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveWorkTasks(tasks) {
  localStorage.setItem(storageKeys.workTasks, JSON.stringify(tasks));
}

function readHabits() {
  try {
    const savedHabits = JSON.parse(localStorage.getItem(storageKeys.habits) || "[]");
    return Array.isArray(savedHabits) ? savedHabits : [];
  } catch {
    return [];
  }
}

function saveHabits(habits) {
  localStorage.setItem(storageKeys.habits, JSON.stringify(habits));
}

function readJournalEntries() {
  try {
    const savedEntries = JSON.parse(localStorage.getItem(storageKeys.journal) || "[]");
    return Array.isArray(savedEntries) ? savedEntries : [];
  } catch {
    return [];
  }
}

function saveJournalEntries(entries) {
  localStorage.setItem(storageKeys.journal, JSON.stringify(entries));
}

function getPriorityRank(priority) {
  const ranks = {
    Alta: 0,
    Media: 1,
    Baja: 2,
  };

  return ranks[priority] ?? 3;
}

function formatDueDate(value) {
  if (!value) {
    return "Sin fecha de entrega";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function renderWorkPriority() {
  const highPriorityTask = readWorkTasks()
    .filter((task) => task.priority === "Alta" && !task.done)
    .sort((firstTask, secondTask) => {
      if (firstTask.due && secondTask.due) {
        return firstTask.due.localeCompare(secondTask.due);
      }

      if (firstTask.due && !secondTask.due) {
        return -1;
      }

      if (!firstTask.due && secondTask.due) {
        return 1;
      }

      return Number(firstTask.id) - Number(secondTask.id);
    })[0];

  if (!highPriorityTask) {
    workPriorityTitle.textContent = "Define el objetivo principal";
    workPriorityDescription.textContent =
      "Este bloque marca el asunto mas importante de la jornada. Lo que pongamos aqui debe tener prioridad sobre el resto del trabajo.";
    workPriorityStack.innerHTML = `
      <span>Proyecto critico</span>
      <span>Entrega principal</span>
      <span>Seguimiento urgente</span>
    `;
    return;
  }

  workPriorityTitle.textContent = highPriorityTask.name;
  workPriorityDescription.textContent =
    highPriorityTask.definition ||
    "Trabajo de alta importancia activo. Mientras este pendiente, debe mantenerse visible como prioridad principal.";
  workPriorityStack.innerHTML = `
    <span>Importancia: Alta</span>
    <span>Entrega: ${formatDueDate(highPriorityTask.due)}</span>
    <span>Estado: Pendiente</span>
  `;
}

function renderWorkTasks() {
  const tasks = readWorkTasks().sort((firstTask, secondTask) => {
    if (firstTask.done !== secondTask.done) {
      return firstTask.done ? 1 : -1;
    }

    if (firstTask.due && secondTask.due && firstTask.due !== secondTask.due) {
      return firstTask.due.localeCompare(secondTask.due);
    }

    if (firstTask.due && !secondTask.due) {
      return -1;
    }

    if (!firstTask.due && secondTask.due) {
      return 1;
    }

    return getPriorityRank(firstTask.priority) - getPriorityRank(secondTask.priority);
  });

  if (tasks.length === 0) {
    workTaskList.innerHTML = '<p class="work-empty">Agrega trabajos, entregas o tareas laborales para ordenarlas por importancia y fecha.</p>';
    return;
  }

  workTaskList.innerHTML = tasks
    .map((task) => {
      const priorityClass = task.priority.toLowerCase();

      return `
        <div class="work-task${task.done ? " is-done" : ""}" data-work-task-id="${task.id}">
          <div class="work-task-main">
            <strong>${escapeHtml(task.name)}</strong>
            <span>Entrega: ${formatDueDate(task.due)}</span>
            ${task.definition ? `<p>${escapeHtml(task.definition)}</p>` : ""}
          </div>
          <span class="priority-chip ${priorityClass}">${task.priority}</span>
          <button class="work-task-done" type="button">${task.done ? "Pendiente" : "Hecho"}</button>
          <button class="work-task-remove" type="button">x</button>
        </div>
      `;
    })
    .join("");
}

function addCurrentWorkTask() {
  const name = workTaskName.value.trim();
  const definition = workTaskDefinition.value.trim();

  if (!name) {
    workTaskName.focus();
    return;
  }

  if (!definition) {
    workTaskDefinition.focus();
    return;
  }

  const tasks = readWorkTasks();
  tasks.push({
    id: String(Date.now()),
    name,
    definition,
    priority: workTaskPriority.value,
    due: workTaskDue.value,
    done: false,
  });

  saveWorkTasks(tasks);
  workTaskName.value = "";
  workTaskDefinition.value = "";
  workTaskPriority.value = "Alta";
  workTaskDue.value = "";
  renderWorkPriority();
  renderWorkTasks();
}

function updateWorkTask(taskId, updater) {
  const tasks = readWorkTasks().map((task) => {
    return task.id === taskId ? updater(task) : task;
  });

  saveWorkTasks(tasks);
  renderWorkPriority();
  renderWorkTasks();
}

function removeWorkTask(taskId) {
  saveWorkTasks(readWorkTasks().filter((task) => task.id !== taskId));
  renderWorkPriority();
  renderWorkTasks();
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDailyStorageKey() {
  return `${storageKeys.dailyPrefix}${getDateKey()}`;
}

function isHabitDoneToday(habit) {
  return (habit.doneDates || []).includes(getDateKey());
}

function renderHabitSummary() {
  const habits = readHabits();
  const doneCount = habits.filter(isHabitDoneToday).length;
  const totalCount = habits.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  habitSummaryBadge.textContent = `${percent}%`;
  habitDoneCount.textContent = `${doneCount}/${totalCount}`;

  if (totalCount === 0) {
    habitSummaryTitle.textContent = "Mejora 1% cada dia";
    habitSummaryDescription.textContent =
      "Crea habitos pequenos, claros y faciles de repetir. La meta es construir identidad, no depender de motivacion.";
    habitSummaryStack.innerHTML = `
      <span>Senal clara</span>
      <span>Accion pequena</span>
      <span>Recompensa inmediata</span>
    `;
    habitCoachNote.textContent =
      "Empieza con una accion tan pequena que sea dificil fallar. La constancia gana fuerza con repeticion.";
    return;
  }

  habitSummaryTitle.textContent = `${doneCount} de ${totalCount} habitos hechos hoy`;
  habitSummaryDescription.textContent =
    percent >= 80
      ? "Buen ritmo. Mantener el sistema simple ayuda a que el habito se vuelva parte normal del dia."
      : "Busca reducir la friccion: prepara el ambiente, baja la dificultad y deja visible la senal.";
  habitSummaryStack.innerHTML = `
    <span>Progreso diario: ${percent}%</span>
    <span>Habitos pendientes: ${totalCount - doneCount}</span>
    <span>Regla: facil, visible y repetible</span>
  `;
  habitCoachNote.textContent =
    doneCount === totalCount
      ? "Dia completo. La recompensa visual importa: ver el avance refuerza la conducta."
      : "Si cuesta empezar, baja la accion minima. Un habito pequeno hecho vale mas que uno perfecto pendiente.";
}

function renderHabits() {
  const habits = readHabits();

  renderHabitSummary();

  if (habits.length === 0) {
    habitList.innerHTML =
      '<p class="habit-empty">Agrega tu primer habito con una senal, una accion minima y una recompensa simple.</p>';
    return;
  }

  habitList.innerHTML = habits
    .map((habit) => {
      const isDone = isHabitDoneToday(habit);

      return `
        <div class="habit-item${isDone ? " is-done" : ""}" data-habit-id="${habit.id}">
          <div class="habit-main">
            <div class="habit-title-row">
              <strong>${escapeHtml(habit.name)}</strong>
              <span>${escapeHtml(habit.category)}</span>
            </div>
            <p>${escapeHtml(habit.identity || "Soy una persona que mejora con acciones pequenas.")}</p>
            <div class="habit-steps">
              <span>Senal: ${escapeHtml(habit.cue || "Elegir una senal clara")}</span>
              <span>Accion: ${escapeHtml(habit.action)}</span>
              <span>Recompensa: ${escapeHtml(habit.reward || "Marcarlo como hecho")}</span>
            </div>
          </div>
          <button class="habit-done" type="button">${isDone ? "Hecho hoy" : "Marcar hoy"}</button>
          <button class="habit-remove" type="button">x</button>
        </div>
      `;
    })
    .join("");
}

function addCurrentHabit() {
  const name = habitName.value.trim();
  const action = habitAction.value.trim();

  if (!name) {
    habitName.focus();
    return;
  }

  if (!action) {
    habitAction.focus();
    return;
  }

  const habits = readHabits();
  habits.unshift({
    id: String(Date.now()),
    name,
    identity: habitIdentity.value.trim(),
    cue: habitCue.value.trim(),
    action,
    reward: habitReward.value.trim(),
    category: habitCategory.value,
    doneDates: [],
  });

  saveHabits(habits);
  habitName.value = "";
  habitIdentity.value = "";
  habitCue.value = "";
  habitAction.value = "";
  habitReward.value = "";
  habitCategory.value = "Salud";
  renderHabits();
}

function updateHabit(habitId, updater) {
  const habits = readHabits().map((habit) => {
    return habit.id === habitId ? updater(habit) : habit;
  });

  saveHabits(habits);
  renderHabits();
}

function removeHabit(habitId) {
  saveHabits(readHabits().filter((habit) => habit.id !== habitId));
  renderHabits();
}

function formatJournalDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function loadTodayJournalEntry() {
  const today = getDateKey();
  const todayEntry = readJournalEntries().find((entry) => entry.date === today);

  if (!todayEntry) {
    journalEnergy.value = "Media";
    journalProgress.value = "";
    journalLesson.value = "";
    return;
  }

  journalEnergy.value = todayEntry.energy || "Media";
  journalProgress.value = todayEntry.progress || "";
  journalLesson.value = todayEntry.lesson || "";
}

function renderJournalEntries() {
  const entries = readJournalEntries().sort((firstEntry, secondEntry) => {
    return secondEntry.date.localeCompare(firstEntry.date);
  });

  if (entries.length === 0) {
    journalList.innerHTML =
      '<p class="journal-empty">Aun no hay progresos guardados. Escribe como estuvo tu dia para empezar a ver tu avance.</p>';
    return;
  }

  journalList.innerHTML = entries
    .map(
      (entry) => `
        <div class="journal-entry" data-journal-id="${entry.id}">
          <div class="journal-entry-head">
            <strong>${formatJournalDate(entry.date)}</strong>
            <span>Energia: ${escapeHtml(entry.energy || "Media")}</span>
          </div>
          <p>${escapeHtml(entry.progress)}</p>
          ${entry.lesson ? `<small>${escapeHtml(entry.lesson)}</small>` : ""}
          <button class="journal-remove" type="button">x</button>
        </div>
      `
    )
    .join("");
}

function saveCurrentJournalEntry() {
  const progress = journalProgress.value.trim();
  const lesson = journalLesson.value.trim();

  if (!progress) {
    journalProgress.focus();
    return;
  }

  const today = getDateKey();
  const entries = readJournalEntries();
  const existingIndex = entries.findIndex((entry) => entry.date === today);
  const entry = {
    id: existingIndex >= 0 ? entries[existingIndex].id : String(Date.now()),
    date: today,
    energy: journalEnergy.value,
    progress,
    lesson,
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.unshift(entry);
  }

  saveJournalEntries(entries);
  renderJournalEntries();
}

function removeJournalEntry(entryId) {
  saveJournalEntries(readJournalEntries().filter((entry) => entry.id !== entryId));
  renderJournalEntries();
  loadTodayJournalEntry();
}

function readDailyTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(getDailyStorageKey()) || "[]");
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveDailyTasks(tasks) {
  localStorage.setItem(getDailyStorageKey(), JSON.stringify(tasks));
}

function renderDailyDate() {
  dailyDate.textContent = dateFormatter.format(new Date());
}

function renderDailyClock() {
  dailyClock.textContent = timeFormatter.format(new Date());
}

function renderDailyTasks() {
  const tasks = readDailyTasks().sort((firstTask, secondTask) => {
    return firstTask.time.localeCompare(secondTask.time);
  });

  if (tasks.length === 0) {
    dailyTaskList.innerHTML = '<p class="daily-empty">Planifica las tareas importantes de hoy. A las 00:00 este panel queda limpio para el dia siguiente.</p>';
    return;
  }

  dailyTaskList.innerHTML = tasks
    .map(
      (task) => `
        <div class="daily-task${task.done ? " is-done" : ""}" data-task-id="${task.id}">
          <span class="daily-check" aria-hidden="true">${task.done ? "ok" : ""}</span>
          <div class="daily-copy">
            <strong>${escapeHtml(task.text)}</strong>
            <span>${task.time || "Sin hora"}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function addCurrentDailyTask() {
  const text = dailyTaskText.value.trim();

  if (!text) {
    dailyTaskText.focus();
    return;
  }

  const tasks = readDailyTasks();
  tasks.push({
    id: String(Date.now()),
    time: timeFormatter.format(new Date()),
    text,
    done: false,
  });

  saveDailyTasks(tasks);
  dailyTaskText.value = "";
  renderDailyTasks();
}

function updateDailyTask(taskId, updater) {
  const tasks = readDailyTasks().map((task) => {
    return task.id === taskId ? updater(task) : task;
  });

  saveDailyTasks(tasks);
  renderDailyTasks();
}

function scheduleDailyReset() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);

  window.setTimeout(() => {
    renderDailyDate();
    renderDailyTasks();
    scheduleDailyReset();
  }, nextMidnight.getTime() - now.getTime() + 500);
}

function renderCashFlow(incomeValue, expenseValue) {
  const income = normalizeMoney(incomeValue);
  const expense = normalizeMoney(expenseValue);
  const total = income + expense;
  const incomePercent = total > 0 ? Math.round((income / total) * 100) : 0;
  const incomeDegrees = total > 0 ? (income / total) * 360 : 0;
  const balance = income - expense;

  cashFlowPie.style.setProperty("--income-slice", `${incomeDegrees}deg`);
  cashFlowPercent.textContent = `${incomePercent}%`;
  incomeTotal.textContent = moneyFormatter.format(income);
  expenseTotal.textContent = moneyFormatter.format(expense);
  flowResult.textContent = `Balance ${moneyFormatter.format(balance)}`;
  expenseDisplay.textContent = moneyFormatter.format(expense);
}

function renderCashFlowFromStorage() {
  renderCashFlow(
    localStorage.getItem(storageKeys.bankBalance) || 0,
    getExpenseTotal()
  );
}

function renderExpenses() {
  const expenses = readExpenses();

  if (expenses.length === 0) {
    expenseList.innerHTML = '<p class="expense-empty">Aun no hay salidas registradas.</p>';
    return;
  }

  expenseList.innerHTML = expenses
    .map(
      (expense) => `
        <div class="expense-item" data-expense-id="${expense.id}">
          <strong>${escapeHtml(expense.name)}</strong>
          <span>${moneyFormatter.format(normalizeMoney(expense.amount))}</span>
          <button class="expense-remove" type="button" aria-label="Eliminar ${escapeHtml(expense.name)}">x</button>
        </div>
      `
    )
    .join("");
}

function addCurrentExpense() {
  const name = expenseNameInput.value.trim() || "Salida sin nombre";
  const amount = normalizeMoney(expenseAmountInput.value);

  if (amount <= 0) {
    expenseAmountInput.focus();
    return;
  }

  const expenses = readExpenses();
  expenses.unshift({
    id: String(Date.now()),
    name,
    amount,
  });

  saveExpenses(expenses);
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  renderExpenses();
  renderCashFlowFromStorage();
}

function removeExpense(expenseId) {
  const expenses = readExpenses().filter((expense) => expense.id !== expenseId);
  saveExpenses(expenses);
  renderExpenses();
  renderCashFlowFromStorage();
}

renderBankBalance(localStorage.getItem(storageKeys.bankBalance) || 0);
renderExpenses();
renderCashFlowFromStorage();
renderWorkPriority();
renderWorkTasks();
renderHabits();
loadTodayJournalEntry();
renderJournalEntries();
renderDailyDate();
renderDailyClock();
renderDailyTasks();
scheduleDailyReset();
window.setInterval(renderDailyClock, 1000);

saveBankBalance.addEventListener("click", saveCurrentBankBalance);
addExpense.addEventListener("click", addCurrentExpense);
addDailyTask.addEventListener("click", addCurrentDailyTask);
addWorkTask.addEventListener("click", addCurrentWorkTask);
addHabit.addEventListener("click", addCurrentHabit);
saveJournalEntry.addEventListener("click", saveCurrentJournalEntry);

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchSection(button.dataset.section);
  });
});

bankBalanceInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveCurrentBankBalance();
  }
});

[expenseNameInput, expenseAmountInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addCurrentExpense();
    }
  });
});

[workTaskName, workTaskDefinition, workTaskPriority, workTaskDue].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addCurrentWorkTask();
    }
  });
});

[habitName, habitIdentity, habitCue, habitAction, habitReward, habitCategory].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCurrentHabit();
    }
  });
});

[journalEnergy, journalProgress, journalLesson].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      saveCurrentJournalEntry();
    }
  });
});

journalList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".journal-remove");
  if (!removeButton) {
    return;
  }

  removeJournalEntry(removeButton.closest(".journal-entry").dataset.journalId);
});

habitList.addEventListener("click", (event) => {
  const habitElement = event.target.closest(".habit-item");
  if (!habitElement) {
    return;
  }

  if (event.target.closest(".habit-done")) {
    updateHabit(habitElement.dataset.habitId, (habit) => {
      const today = getDateKey();
      const doneDates = habit.doneDates || [];

      return {
        ...habit,
        doneDates: doneDates.includes(today)
          ? doneDates.filter((date) => date !== today)
          : [...doneDates, today],
      };
    });
    return;
  }

  if (event.target.closest(".habit-remove")) {
    removeHabit(habitElement.dataset.habitId);
  }
});

workTaskList.addEventListener("click", (event) => {
  const taskElement = event.target.closest(".work-task");
  if (!taskElement) {
    return;
  }

  if (event.target.closest(".work-task-done")) {
    updateWorkTask(taskElement.dataset.workTaskId, (task) => ({
      ...task,
      done: !task.done,
    }));
    return;
  }

  if (event.target.closest(".work-task-remove")) {
    removeWorkTask(taskElement.dataset.workTaskId);
  }
});

expenseList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".expense-remove");
  if (!removeButton) {
    return;
  }

  removeExpense(removeButton.closest(".expense-item").dataset.expenseId);
});

dailyTaskText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addCurrentDailyTask();
  }
});

dailyTaskList.addEventListener("click", (event) => {
  const taskElement = event.target.closest(".daily-task");
  if (!taskElement) {
    return;
  }

  updateDailyTask(taskElement.dataset.taskId, (task) => ({
    ...task,
    done: !task.done,
  }));
});
