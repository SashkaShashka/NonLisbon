import "/components/alert/alert.js";

export function setLoading(form, loading) {
  form.loading = loading;
  form.disabled = true;
  let spinner = form.querySelector(".spinner-border");
  if (loading) {
    if (!spinner) {
      spinner = document.createElement("div");
      spinner.className = "spinner-border text-primary align-self-center";
      form.prepend(spinner);
    }
    form.classList.add("loading");
  } else {
    form.classList.remove("loading");
    spinner?.remove();
  }
}
export function createDateFormat(date) {
  var dateYear = date.substr(0, 4);
  var dateMonth = date.substr(5, 2);
  var dateDay = date.substr(8, 2);
  return dateDay + "." + dateMonth + "." + dateYear;
}

export function setSubmitting(form, submitting) {
  form.submitting = submitting;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.submitting = submitting;
}

export function setAlert(form, message, color = "danger") {
  if (!form.alertElement) {
    form.alertElement = document.createElement("alert-message");
    form.append(form.alertElement);
  }
  form.alertElement.color = color;
  form.alertElement.innerText = message;
  form.alertElement.hidden = !message || undefined;
}

export function attributeValueToBool(value) {
  return value === "" || (!!value && value !== "false");
}

export function attributeValueToFunction(value) {
  if (value instanceof Function) {
    return value;
  }
  const evaluation = eval(value);
  if (evaluation instanceof Function) {
    return evaluation;
  }
  return () => evaluation;
}
