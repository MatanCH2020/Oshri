document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const generateButton = document.getElementById('generate-link');
    const resultContainer = document.getElementById('result');
    const whatsappLinkInput = document.getElementById('whatsapp-link');
    const copyLinkButton = document.getElementById('copy-link');
    const downloadQrButton = document.getElementById('download-qr');
    const phoneError = document.getElementById('phone-error');
    let qrcode = null;

    // Phone number validation
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const validPrefixes = ['050', '051', '052', '053', '054', '055', '058'];
        const prefix = cleanPhone.substring(0, 3);
        
        if (cleanPhone.length !== 10) {
            return { valid: false, message: 'מספר הטלפון חייב להכיל 10 ספרות' };
        }
        
        if (!validPrefixes.includes(prefix)) {
            return { valid: false, message: 'קידומת טלפון לא חוקית' };
        }
        
        return { valid: true, phone: cleanPhone };
    }

    // Generate WhatsApp link
    function generateWhatsappLink(phone, message) {
        const encodedMessage = encodeURIComponent(message);
        return `wa.me/972${phone.substring(1)}?text=${encodedMessage}`;
    }

    // Generate QR Code
    function generateQRCode(url) {
        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = '';
        
        qrcode = new QRCode(qrcodeContainer, {
            text: url,
            width: 256,
            height: 256,
            colorDark: "#075E54",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Event Listeners
    phoneInput.addEventListener('input', (e) => {
        const validation = validatePhone(e.target.value);
        if (!validation.valid) {
            phoneError.textContent = validation.message;
            phoneInput.classList.add('error');
        } else {
            phoneError.textContent = '';
            phoneInput.classList.remove('error');
        }
    });

    generateButton.addEventListener('click', () => {
        const validation = validatePhone(phoneInput.value);
        
        if (!validation.valid) {
            phoneError.textContent = validation.message;
            return;
        }

        const whatsappLink = generateWhatsappLink(validation.phone, messageInput.value);
        whatsappLinkInput.value = whatsappLink;
        generateQRCode(whatsappLink);
        resultContainer.style.display = 'block';
    });

    copyLinkButton.addEventListener('click', async () => {
        try {
            const fullLink = whatsappLinkInput.value;
            await navigator.clipboard.writeText(fullLink);
            copyLinkButton.textContent = 'הועתק!';
            setTimeout(() => {
                copyLinkButton.textContent = 'העתק קישור';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });

    downloadQrButton.addEventListener('click', () => {
        const canvas = document.querySelector('#qrcode canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'oshri-luxury-cars-qr.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    });
});
