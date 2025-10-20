import { GEMINI_API_KEY } from './config.js';

let editingDebtId = null;

// NAVIGATION BETWEEN SCREENS
function showScreen(screenId) {
    const allScreens = document.querySelectorAll('.screen')
    allScreens.forEach(function(screen){
        screen.classList.remove('active')
    });
    const desireScreen = document.getElementById(screenId);
    desireScreen.classList.add('active')
}

// NAVBAR
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        navLinks.forEach(function(l) {
            l.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// LOGIN FORM
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function(event){
    event.preventDefault();

    const userName = document.getElementById('user-name').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    localStorage.setItem('userName', userName);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    showScreen('onboarding-screen');
});

// ONBOARDING STEPS
let currentStep = 1;
function showStep(stepNumber){
    const allSteps = document.querySelectorAll('.form-step')
    allSteps.forEach(function(steps){
        steps.classList.remove('active')
    });
    
    const desiredStep = document.getElementById('step-' + stepNumber)
    desiredStep.classList.add('active')
    currentStep = stepNumber;
    
    updateProgress();
}

const nextButtons = document.querySelectorAll('.btn-next');
nextButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (currentStep === 1) {
            const income = document.getElementById('monthly-income').value;
            if (!income || income <= 0) {
                alert('Please enter your monthly income');
                return;
            }
        }
        
        if (currentStep === 2) {
            const frequency = document.getElementById('pay-frequency').value;
            const payday = document.getElementById('payday-1').value;
            
            if (!frequency) {
                alert('Please select how often you get paid');
                return; 
            }
            if (!payday) {
                alert('Please select your next payday');
                return; 
            }
            
            if (frequency === 'bi-weekly') {
                const payday2 = document.getElementById('payday-2').value;
                if (!payday2) {
                    alert('Please select your second payday');
                    return;
                }
            }
        }
        showStep(currentStep + 1);
    });
});

const backButtons = document.querySelectorAll('.btn-back');
backButtons.forEach(function(back){
    back.addEventListener('click', function(){
        showStep(currentStep - 1);
    });
});

// PAY FREQUENCY CHANGE
const payFrequency = document.getElementById('pay-frequency');
const payday2Container = document.getElementById('payday-2-container');

payFrequency.addEventListener('change', function() {
    if (this.value === 'bi-weekly') {
        payday2Container.classList.remove('hidden');
    } else {
        payday2Container.classList.add('hidden');
    }
});

// SAVINGS SLIDER
const slider = document.getElementById('savings-percentage');
const savingsValue = document.getElementById('savings-value');
const savingsPreview = document.getElementById('savings-preview');

slider.addEventListener('input', function(){
    const percentage = slider.value;
    const income = document.getElementById('monthly-income').value;
    const savingsAmount = (income * percentage) / 100;
    
    savingsValue.textContent = percentage + '%';
    savingsPreview.textContent = "You'll save: $" + savingsAmount.toFixed(2) + '/month';
});

const completeButton = document.getElementById('finish-onboarding-btn');
completeButton.addEventListener('click', function(e){
    e.preventDefault();
    const income = document.getElementById('monthly-income').value;
    const frequency = document.getElementById('pay-frequency').value;
    const payday = document.getElementById('payday-1').value;
    const savings = document.getElementById('savings-percentage').value;
    
    localStorage.setItem('savingsPercentage', savings);
    localStorage.setItem('monthlyIncome', income);
    localStorage.setItem('payFrequency', frequency);
    localStorage.setItem('payday', payday);
    
    if (frequency === 'bi-weekly') {
        const payday2 = document.getElementById('payday-2').value;
        localStorage.setItem('payday2', payday2);
    } else {
        localStorage.removeItem('payday2');
    }
    
    showScreen('dashboard-screen');
    loadDashboardData();
    displayUserName();
    loadMonthlyBreakdown();
    displayDebts();
    generateAIPaymentPlan();
});

// PROGRESS BAR
function updateProgress(){
    const percentage = (currentStep / 3) * 100;
    const barra = document.getElementById('progress-fill');
    barra.style.width = percentage + '%'; 
    const barText = document.getElementById('progress-text');
    barText.textContent = 'Step ' + currentStep + ' of 3';
}

// DASHBOARD DATA
function loadDashboardData() {
    const readIncome = parseFloat(localStorage.getItem('monthlyIncome'));
    const readSavings = parseFloat(localStorage.getItem('savingsPercentage'));
    const readPayday = localStorage.getItem('payday');
    const readPayday2 = localStorage.getItem('payday2');
    const frequency = localStorage.getItem('payFrequency');
    
    const savedDebts = localStorage.getItem('debts');
    let totalDebts = 0;
    
    if (savedDebts) {
        const debts = JSON.parse(savedDebts);
        totalDebts = debts.reduce(function(sum, debt) {
            return sum + debt.amount;
        }, 0);
    }
    
    const savingsAmount = (readIncome * readSavings) / 100;
    const availableBalance = readIncome - savingsAmount;
    
    document.getElementById('display-available').textContent = '$' + availableBalance.toFixed(2);
    document.getElementById('display-income').textContent = '$' + readIncome.toFixed(2);
    document.getElementById('display-savings').textContent = '$' + savingsAmount.toFixed(2);
    document.getElementById('display-total-debts').textContent = '$' + totalDebts.toFixed(2);
    
    if (frequency === 'bi-weekly' && readPayday2) {
        document.getElementById('next-payday').textContent = 'Next paydays: ' + readPayday + ' & ' + readPayday2;
    } else {
        document.getElementById('next-payday').textContent = 'Next payday: ' + readPayday;
    }
}

// OPEN ADD DEBT MODAL
const addDebtBtn = document.getElementById('add-debt-btn');
const debtModal = document.getElementById('debt-modal');
const closeModalBtn = document.querySelector('.close-modal');

addDebtBtn.addEventListener('click', function() {
    editingDebtId = null;
    debtForm.reset();
    document.querySelector('.modal-header h3').textContent = 'Add New Debt';
    debtModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', function() {
    debtModal.classList.add('hidden');
});

// ADD OR EDIT DEBT
const debtForm = document.getElementById('debt-form');

debtForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const debtName = document.getElementById('debt-name').value;
    const debtAmount = parseFloat(document.getElementById('debt-amount').value);
    const debtMinimum = parseFloat(document.getElementById('debt-minimum').value);
    const debtDue = document.getElementById('debt-due').value;
    
    if (debtAmount <= 0 || debtMinimum <= 0) {
        alert('Amounts must be greater than zero');
        return;
    }
    
    if (debtMinimum > debtAmount) {
        alert('Minimum payment cannot be greater than total amount');
        return;
    }
    
    let debts = [];
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) {
        debts = JSON.parse(savedDebts);
    }
    
    if (editingDebtId) {
        debts = debts.map(function(debt) {
            if (debt.id == editingDebtId) {
                return {
                    id: debt.id,
                    name: debtName,
                    amount: debtAmount,
                    minimum: debtMinimum,
                    dueDate: debtDue
                };
            }
            return debt;
        });
        editingDebtId = null;
    } else {
        const newDebt = {
            id: Date.now(),
            name: debtName,
            amount: debtAmount,
            minimum: debtMinimum,
            dueDate: debtDue
        };
        debts.push(newDebt);
    }
    
    const totalMinimumPayments = debts.reduce(function(sum, debt) {
        return sum + debt.minimum;
    }, 0);
    
    const readIncome = parseFloat(localStorage.getItem('monthlyIncome'));
    const readSavings = parseFloat(localStorage.getItem('savingsPercentage'));
    const savingsAmount = (readIncome * readSavings) / 100;
    const availableBalance = readIncome - savingsAmount;
    
    if (totalMinimumPayments > availableBalance) {
        alert('Warning: Your total minimum payments ($' + totalMinimumPayments.toFixed(2) + ') exceed your available balance ($' + availableBalance.toFixed(2) + '). You may need to adjust your budget.');
    }
    
    localStorage.setItem('debts', JSON.stringify(debts));
    debtModal.classList.add('hidden');
    debtForm.reset();
    document.querySelector('.modal-header h3').textContent = 'Add New Debt';
    
    displayDebts();
    loadDashboardData();
    loadMonthlyBreakdown();
    generateAIPaymentPlan();
});

// DISPLAY DEBTS
function displayDebts(){
    const savedDebts = localStorage.getItem('debts');
    const container = document.getElementById('debt-list-container');
    const emptyState = document.getElementById('empty-debt-state');
    container.innerHTML = '';
    
    if (!savedDebts || savedDebts === '[]') {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    const debts = JSON.parse(savedDebts);
    
    debts.forEach(function(debt){
        const debtCard = `
            <div class="debt-card">
                <h3>${debt.name}</h3>
                <p><strong>Total Amount:</strong> $${debt.amount.toFixed(2)}</p>
                <p><strong>Minimum Payment:</strong> $${debt.minimum.toFixed(2)}</p>
                <p><strong>Due Date:</strong> ${debt.dueDate}</p>
                <div class="debt-actions">
                    <button class="btn-edit" data-id="${debt.id}">Edit</button>
                    <button class="btn-delete" data-id="${debt.id}">Delete</button>
                </div>
            </div>
        `;
        container.innerHTML += debtCard;
    });
}

// EDIT OR DELETE DEBT
const debtContainer = document.getElementById('debt-list-container');
debtContainer.addEventListener('click', function(e) {
    
    if (e.target.classList.contains('btn-edit')) {
        const debtId = e.target.dataset.id;
        const savedDebts = localStorage.getItem('debts');
        const debts = JSON.parse(savedDebts);
        
        const debtToEdit = debts.find(function(debt) {
            return debt.id == debtId;
        });
        
        document.getElementById('debt-name').value = debtToEdit.name;
        document.getElementById('debt-amount').value = debtToEdit.amount;
        document.getElementById('debt-minimum').value = debtToEdit.minimum;
        document.getElementById('debt-due').value = debtToEdit.dueDate;
        
        editingDebtId = debtId;
        document.querySelector('.modal-header h3').textContent = 'Edit Debt';
        debtModal.classList.remove('hidden');
    }
    
    if (e.target.classList.contains('btn-delete')) {
        const debtId = e.target.dataset.id;
        
        if (confirm('Are you sure you want to delete this debt?')) {
            const savedDebts = localStorage.getItem('debts');
            let debts = JSON.parse(savedDebts);
            
            debts = debts.filter(function(debt) {
                return debt.id != debtId;
            });
            
            localStorage.setItem('debts', JSON.stringify(debts));
            displayDebts();
            loadDashboardData();
            loadMonthlyBreakdown();
            generateAIPaymentPlan();
        }
    }
});

// CLEAR ALL DEBTS
const clearDebtBtn = document.getElementById('clear-debt-btn');
clearDebtBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete ALL debts? This cannot be undone.')) {
        localStorage.setItem('debts', JSON.stringify([]));
        displayDebts();
        loadDashboardData();
        loadMonthlyBreakdown();
        generateAIPaymentPlan();
    }
});

// MONTHLY BREAKDOWN
function loadMonthlyBreakdown() {
    const readIncome = parseFloat(localStorage.getItem('monthlyIncome'));
    const readSavings = parseFloat(localStorage.getItem('savingsPercentage'));
    const savingsAmount = (readIncome * readSavings) / 100;
    
    const savedDebts = localStorage.getItem('debts');
    let totalPayments = 0;
    
    if (savedDebts) {
        const debts = JSON.parse(savedDebts);
        totalPayments = debts.reduce(function(sum, debt) {
            return sum + debt.minimum;
        }, 0);
    }
    
    const remaining = readIncome - savingsAmount - totalPayments;
    
    document.getElementById('summary-income').textContent = '$' + readIncome.toFixed(2);
    document.getElementById('summary-payments').textContent = '$' + totalPayments.toFixed(2);
    document.getElementById('summary-savings').textContent = '$' + savingsAmount.toFixed(2);
    document.getElementById('summary-remaining').textContent = '$' + remaining.toFixed(2);
}

function displayBasicPaymentPlan() {
    const savedDebts = localStorage.getItem('debts');
    const container = document.getElementById('priority-debts-list');
    
    if (!savedDebts || savedDebts === '[]') {
        container.innerHTML = '<p class="placeholder">Add debts to see your payment plan</p>';
        return;
    }
    
    const debts = JSON.parse(savedDebts);
    const readIncome = parseFloat(localStorage.getItem('monthlyIncome'));
    const readSavings = parseFloat(localStorage.getItem('savingsPercentage'));
    const savingsAmount = (readIncome * readSavings) / 100;
    
    const sortedDebts = debts.sort(function(a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    container.innerHTML = '<h3 style="margin-bottom: 16px;">📅 Priority Order (by due date)</h3>';
    
    sortedDebts.forEach(function(debt, index) {
        const priority = index + 1;
        const debtItem = `
            <div style="background: var(--beige); padding: 16px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #b4b4b4;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: var(--red);">Priority #${priority}</span>
                    <span style="font-size: 14px; color: rgba(0,0,0,0.6);">Due: ${debt.dueDate}</span>
                </div>
                <h4 style="font-size: 18px; margin-bottom: 8px;">${debt.name}</h4>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span>Balance: <strong>$${debt.amount.toFixed(2)}</strong></span>
                    <span>Minimum: <strong>$${debt.minimum.toFixed(2)}</strong></span>
                </div>
            </div>
        `;
        container.innerHTML += debtItem;
    });
    
    const totalMinimums = sortedDebts.reduce(function(sum, debt) {
        return sum + debt.minimum;
    }, 0);
    const availableBalance = readIncome - savingsAmount;
    const extraMoney = availableBalance - totalMinimums;
    
    if (extraMoney > 0) {
        const suggestion = `
            <div style="background: #e8f5e9; padding: 16px; border-radius: 12px; margin-top: 16px; border: 2px solid #4caf50;">
                <p style="font-size: 15px; color: #2e7d32; margin-bottom: 8px;">💡 <strong>Smart Tip:</strong></p>
                <p style="font-size: 14px; color: #1b5e20;">You have <strong>$${extraMoney.toFixed(2)}</strong> extra after minimum payments. Consider putting this toward <strong>${sortedDebts[0].name}</strong> to pay it off faster!</p>
            </div>
        `;
        container.innerHTML += suggestion;
    } else if (extraMoney < 0) {
        const warning = `
            <div style="background: #ffebee; padding: 16px; border-radius: 12px; margin-top: 16px; border: 2px solid #f44336;">
                <p style="font-size: 15px; color: #c62828; margin-bottom: 8px;">⚠️ <strong>Budget Alert:</strong></p>
                <p style="font-size: 14px; color: #b71c1c;">Your minimum payments exceed your available income by <strong>$${Math.abs(extraMoney).toFixed(2)}</strong>. Consider adjusting your budget or contacting creditors.</p>
            </div>
        `;
        container.innerHTML += warning;
    }
}

// AI PAYMENT PLAN GENERATOR
async function generateAIPaymentPlan() {
    const savedDebts = localStorage.getItem('debts');
    
    if (!savedDebts || savedDebts === '[]') {
        document.getElementById('priority-debts-list').innerHTML = '<p class="placeholder">Add debts to get an AI-powered payment plan</p>';
        return;
    }
    
    const debts = JSON.parse(savedDebts);
    const readIncome = parseFloat(localStorage.getItem('monthlyIncome'));
    const readSavings = parseFloat(localStorage.getItem('savingsPercentage'));
    const savingsAmount = (readIncome * readSavings) / 100;
    const availableBalance = readIncome - savingsAmount;
    
    const debtsInfo = debts.map(function(debt, index) {
        return `Debt ${index + 1}: ${debt.name}, Balance $${debt.amount.toFixed(2)}, Minimum payment $${debt.minimum.toFixed(2)}, Due date ${debt.dueDate}`;
    }).join('. ');
    
    const prompt = `I need financial advice. Here is my situation:

Monthly income: $${readIncome.toFixed(2)}
Monthly savings: $${savingsAmount.toFixed(2)}
Available for debt payments: $${availableBalance.toFixed(2)}

My debts: ${debtsInfo}

Please provide a debt payment strategy with: 1) Which debt to prioritize and why, 2) Recommended payment amounts, 3) Timeline estimate, 4) Two practical tips. Keep response under 200 words.`;

    const container = document.getElementById('priority-debts-list');
    container.innerHTML = '<p style="text-align: center; padding: 40px;"><strong>🤖 AI is analyzing your finances...</strong></p>';
    
    try {
        const MODEL_NAME = "models/gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Full Gemini Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const aiPlan = data.candidates[0].content.parts[0].text;
            
            console.log('AI Plan:', aiPlan);
            
            container.innerHTML = `
                <div style="background: white; padding: 24px; border-radius: 12px; border: 2px solid var(--red);">
                    <h3 style="margin-bottom: 16px; color: var(--red);">🤖 AI-Powered Payment Strategy</h3>
                    <div style="white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${aiPlan}</div>
                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #ddd;">
                        <p style="font-size: 13px; color: #666; font-style: italic;">✨ Powered by Google Gemini AI</p>
                    </div>
                </div>
            `;
        } else {
            console.error('Unexpected response structure:', data);
            throw new Error('Could not extract AI response');
        }
        
    } catch (error) {
        console.error('AI Error:', error);
        container.innerHTML = `
            <div style="background: #ffebee; padding: 20px; border-radius: 12px; border: 2px solid #f44336;">
                <p style="color: #c62828; margin-bottom: 8px;"><strong>⚠️ AI service temporarily unavailable</strong></p>
                <p style="font-size: 14px; color: #b71c1c;">Showing intelligent fallback plan.</p>
            </div>
        `;
        displayBasicPaymentPlan();
    }
}

// DISPLAY USER NAME
function displayUserName() {
    const userName = localStorage.getItem('name');
    const userElement = document.getElementById('user-name-profile');
    if (userName) {
        userElement.textContent = userName;
    } else {
        userElement.textContent = 'User';
    }
}

// LOGOUT
const logOut = document.querySelector('.user-profile');
logOut.addEventListener('click', function(){
    if (confirm('Do you want to logout?')) {
        localStorage.clear();
        location.reload();
    }
});