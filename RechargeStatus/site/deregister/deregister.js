const phoneInput = document.getElementById('phone');
const codeInput = document.getElementById('code');
const reasonSelect = document.getElementById('reasonSelect');
const sendCodeBtn = document.getElementById('sendCodeBtn');
const submitBtn = document.getElementById('submitBtn');

// Helper to get the actual reason value
function getReasonValue() {
    return reasonSelect.value;
}

function updateSubmitState() {
    const phoneNumber = '+1' + phoneInput.value.trim();
    const code = codeInput.value.trim();
    const reason = getReasonValue();
    submitBtn.disabled = !(phoneNumber && code && reason);
}

reasonSelect.addEventListener('change', updateSubmitState);
phoneInput.addEventListener('input', updateSubmitState);
codeInput.addEventListener('input', updateSubmitState);

sendCodeBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const phoneNumber = '+1' + phoneInput.value.trim();
    if (!phoneNumber) {
        alert('Please enter your phone number.');
        return;
    }
    try {
        const requestBody = {
            PhoneNumber: phoneNumber
        };
        const response = await fetch('https://cusmgmapi-aefrhuckeggxdnh7.canadacentral-01.azurewebsites.net/api/SMS/SendVerificationCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            alert('Failed to send verification code. Please try again.');
            return;
        }
        alert('Verification code sent.');
        codeInput.disabled = false;
    } catch (error) {
        alert('Error occurred.');
    }
});

submitBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const phoneNumber = '+1' + phoneInput.value.trim();
    const code = codeInput.value.trim();
    const reason = getReasonValue();

    if (!(phoneNumber && code && reason)) {
        alert('Please complete all fields.');
        return;
    }

    const dto = {
        PhoneNumber: phoneNumber,
        Reason: reason,
        Code: code,
        RequestAt: new Date().toISOString()
    };

    try {
        const response = await fetch('https://cusmgmapi-aefrhuckeggxdnh7.canadacentral-01.azurewebsites.net/api/SMS/RequestDeleteAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!response.ok) {
            alert('Failed to submit deregistration. Please try again.');
            return;
        }
        alert('Your deregistration has been submitted.');
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Initial state
codeInput.disabled = false;
submitBtn.disabled = true;