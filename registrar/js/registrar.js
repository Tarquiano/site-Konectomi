document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro-form');
    if (!form) return;

    // Elementos do formulário
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtnStep1 = document.getElementById('next-btn-step1');
    const prevBtnStep2 = document.getElementById('prev-btn-step2');
    const confirmBtn = document.getElementById('confirm-btn');
    const toggleExtraBtn = document.getElementById('toggle-extra-questions');
    const extraQuestionsDiv = document.getElementById('extra-questions');

    // Elementos da etapa de confirmação
    const loader = document.getElementById('confirmation-loader');
    const confirmationContent = document.getElementById('confirmation-content');
    const confirmationError = document.getElementById('confirmation-error');
    const robloxAvatar = document.getElementById('roblox-avatar');
    const robloxDisplayName = document.getElementById('roblox-display-name');
    const robloxUserHandle = document.getElementById('roblox-user-handle');

    let currentStep = 1;

    // --- NAVEGAÇÃO E VALIDAÇÃO ---
    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('is-active'));
        document.getElementById(`step-${stepNumber}`).classList.add('is-active');

        progressSteps.forEach(pStep => {
            pStep.classList.remove('is-active');
            if (parseInt(pStep.dataset.step) <= stepNumber) {
                pStep.classList.add('is-active');
            }
        });
        currentStep = stepNumber;
    };

    const validateStep1 = () => {
        let isValid = true;
        const email = form.querySelector('#email');
        const username = form.querySelector('#roblox-username');
        const interest = form.querySelector('input[name="interest"]:checked');

        // Valida Email
        if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
            email.parentElement.classList.add('is-invalid');
            isValid = false;
        } else {
            email.parentElement.classList.remove('is-invalid');
        }

        // Valida Roblox Username
        if (!username.value) {
            username.parentElement.classList.add('is-invalid');
            isValid = false;
        } else {
            username.parentElement.classList.remove('is-invalid');
        }

        // Valida Interesse
        if (!interest) {
            form.querySelector('fieldset').parentElement.classList.add('is-invalid');
            isValid = false;
        } else {
            form.querySelector('fieldset').parentElement.classList.remove('is-invalid');
        }

        return isValid;
    };

    // --- API ROBLOX ---
    const fetchRobloxUser = async () => {
        const username = document.getElementById('roblox-username').value;
        
        loader.style.display = 'block';
        confirmationContent.style.display = 'none';
        confirmationError.style.display = 'none';
        confirmBtn.style.display = 'none';
        document.querySelector('.cf-turnstile').style.display = 'none'; // Esconde o captcha

        showStep(2);

        try {
            const response = await fetch(`http://localhost:3000/api/roblox/user/${username}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no servidor');
            }

            const apiResponse = await response.json();

            if (apiResponse.success) {
                const userData = apiResponse.data;
                robloxAvatar.src = userData.avatarUrl;
                robloxDisplayName.textContent = userData.displayName;
                robloxUserHandle.textContent = `@${userData.username}`;
                confirmationContent.style.display = 'flex';
                confirmBtn.style.display = 'inline-flex';
                document.querySelector('.cf-turnstile').style.display = 'block'; // Mostra o captcha
            } else {
                throw new Error(apiResponse.message);
            }

        } catch (error) {
            console.error("Erro ao buscar usuário do Roblox:", error);
            confirmationError.style.display = 'block';
        } finally {
            loader.style.display = 'none';
        }
    };

    // --- SUBMISSÃO DO FORMULÁRIO ---
    const submitForm = async () => {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Enviando...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.disponibilidade_ferias = Array.from(form.querySelectorAll('input[name="disponibilidade_ferias"]:checked')).map(cb => cb.value);
        data.disponibilidade_fds = Array.from(form.querySelectorAll('input[name="disponibilidade_fds"]:checked')).map(cb => cb.value);

        data.robloxDisplayName = document.getElementById('roblox-display-name').textContent;
        data.robloxAvatarUrl = document.getElementById('roblox-avatar').src;

        console.log("Dados a serem enviados:", data);
        
        const apiEndpoint = 'http://localhost:3000/api/register';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Falha no envio do cadastro.');
            }

            const result = await response.json();
            console.log('Sucesso:', result);
            showStep(3);

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert(`Ocorreu um erro: ${error.message}. Por favor, tente novamente.`);
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Sim, sou eu';
        }
    };

    // --- EVENT LISTENERS ---
    nextBtnStep1.addEventListener('click', () => {
        if (validateStep1()) {
            fetchRobloxUser();
        }
    });

    prevBtnStep2.addEventListener('click', () => {
        showStep(1);
    });
    
    confirmBtn.addEventListener('click', () => {
        submitForm();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    
    toggleExtraBtn.addEventListener('click', () => {
        const isHidden = extraQuestionsDiv.style.display === 'none';
        extraQuestionsDiv.style.display = isHidden ? 'block' : 'none';
        toggleExtraBtn.textContent = isHidden ? 'Ocultar perguntas extras' : 'Responder perguntas extras (Opcional)';
    });
});