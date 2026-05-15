document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("leadFunnelForm");
    if (!container) return;

    var GAS_URL = container.dataset.gasUrl || "";
    var INITIAL_SERVICE = container.dataset.serviceTitle || "";

    var form = document.getElementById("leadForm");
    var layanan = document.getElementById("layanan");
    var submitButton = document.getElementById("submitButton");
    var toast = document.getElementById("leadToast");
    var userAgent = document.getElementById("userAgent");

    if (userAgent) userAgent.value = navigator.userAgent || "";

    if (INITIAL_SERVICE && layanan) {
        layanan.value = INITIAL_SERVICE;
    }

    layanan.addEventListener("change", updateConditionalFields);
    form.addEventListener("submit", handleSubmit);
    updateConditionalFields();

    function updateConditionalFields() {
        var selectedService = layanan.value;

        document.querySelectorAll(".conditional").forEach(function (section) {
            var isActive = section.dataset.service === selectedService;
            if (isActive) {
                section.classList.remove("hidden");
                section.classList.add("grid");
            } else {
                section.classList.add("hidden");
                section.classList.remove("grid");
            }
            section
                .querySelectorAll("input, select, textarea")
                .forEach(function (field) {
                    field.required = isActive;
                    if (!isActive) field.value = "";
                });
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            showToast("Lengkapi field wajib terlebih dahulu.", "error");
            return;
        }

        setLoading(true);

        fetch(GAS_URL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(getFormData()),
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                var result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    result = null;
                }

                if (!result || !result.success) {
                    showToast(
                        result && result.message
                            ? result.message
                            : "Submit gagal.",
                        "error"
                    );
                    setLoading(false);
                    return;
                }

                showToast(result.message, "success");
                form.reset();
                if (INITIAL_SERVICE) layanan.value = INITIAL_SERVICE;
                updateConditionalFields();

                setTimeout(function () {
                    window.location.href = result.whatsappUrl;
                }, 1200);
            })
            .catch(function () {
                showToast(
                    "Terjadi kesalahan jaringan. Silakan coba lagi.",
                    "error"
                );
                setLoading(false);
            });
    }

    function getFormData() {
        var formData = new FormData(form);
        var data = {};
        formData.forEach(function (value, key) {
            data[key] = sanitize(value);
        });
        return data;
    }

    function sanitize(value) {
        return String(value || "")
            .replace(/[<>]/g, "")
            .replace(/[\u0000-\u001F\u007F]/g, "")
            .trim();
    }

    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        var spinner = submitButton.querySelector(".spinner");
        var btnText = submitButton.querySelector(".button-text");
        if (isLoading) {
            submitButton.classList.add("loading");
            spinner.classList.remove("hidden");
            spinner.classList.add("inline-block");
            btnText.textContent = "Mengirim...";
        } else {
            submitButton.classList.remove("loading");
            spinner.classList.add("hidden");
            spinner.classList.remove("inline-block");
            btnText.textContent = "Kirim Konsultasi";
        }
    }

    function showToast(message, type) {
        toast.textContent = message;
        toast.className =
            "fixed right-4 bottom-4 max-w-[min(360px,calc(100vw-32px))] px-4 py-3.5 rounded-2xl shadow-2xl opacity-100 translate-y-0 font-bold z-[9999] transition-all duration-200 ";
        if (type === "success") {
            toast.className += "bg-green-600 text-white";
        } else {
            toast.className += "bg-red-600 text-white";
        }

        clearTimeout(showToast._timeout);
        showToast._timeout = setTimeout(function () {
            toast.className =
                "fixed right-4 bottom-4 max-w-[min(360px,calc(100vw-32px))] px-4 py-3.5 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-2xl opacity-0 translate-y-3.5 pointer-events-none transition-all duration-200 font-bold z-[9999]";
        }, 3600);
    }
});
