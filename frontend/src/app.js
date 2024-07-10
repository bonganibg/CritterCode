class FormData {
    constructor() {
        this._reviewType = 1;
        this._name = undefined;
        this._message = undefined;
        this._mandetoryLink = undefined;
        this._links = [];
    }

    getMessage(){
        // return this.isValid() ? ``
    }

    getFormData() {
        return this.isValid() ? {
            reviewType: this._reviewType,
            name: this._name,
            message: this._message,
            mandetoryLink: this._mandetoryLink,
            links: this._links
        } : undefined;
    }

    isValid() {
        return this._reviewType && this._mandetoryLink && this._message && this._name;
    }

    updateName(name){
        name = this.#cleanText(name);
        this._name = name;
    }

    updateMessage(message) {
        message = this.#cleanText(message);
        this._message = message;
    }

    #cleanText(text) {
        return text
    }

    updateMandetoryLink(link) {
        link = this.#cleanLink(link);
        this._mandetoryLink = link;
    }

    addLink(link) {
        link.link = this.#cleanLink(link.link);

        this._links.push(link);
    }

    #cleanLink(link) {
        if (link === "")
            return undefined;


        const allowedPattern = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;

        if (!allowedPattern.test(link)) {
            return undefined
        }
        return link
    }

    removeLink(linkId) {
        this._links = this._links.filter(link => link.id !== linkId);
    }

    getTotalLinks() {
        return this._links.length;
    }

    updateLink(linkId, link) {
        link = this.#cleanLink(link);

        for (let i in this._links){
            if (this._links[i].id == linkId){
                this._links.link = link
            }
        }
    }
}

class FormControls {
    feedbackType = document.getElementsByClassName("feedback-type");
    feedbackMessage = document.getElementById("feedback-message");
    mandetoryLink = document.getElementById("mandetory-link");
    projectLinkContainer = document.getElementById("project-links");
    addLinkButton = document.getElementById("add-link-button");
    sendReviewButton = document.getElementById("send-review")
    personNameInput = document.getElementById("person-name");

    /**
     * 
     * @param {FormData} formData 
     */
    constructor(formData) {
        this._formData = formData;
        this.addFormEventListeners();
    }

    addFormEventListeners() {
        this.addLinkButton.addEventListener('click', () => {
            this.addNewLinkInput();
        })
        this.#feedbackTypeEventListener();
        this.#addInputEventListener();
        this.#addMandetoryLinkListener();
        this.#sendReviewListner();
        this.#featureNotEnabled();
    }

    #feedbackTypeEventListener() {
        console.log(typeof this.feedbackType)
        for (let element of this.feedbackType) {
            element.addEventListener('click', () => {
                this.clearSelectedStyling();

                element.classList.add("selected")
                this._formData._reviewType = element.getAttribute("data-feedback-type");
            })
        }
    }

    clearSelectedStyling(type) {
        for (let element of this.feedbackType) {        
            element.className = "feedback-type"    
        }
    }

    #addInputEventListener(){
        this.feedbackMessage.addEventListener('change', (e) => this._formData.updateMessage(e.target.value));
        this.personNameInput.addEventListener('change', (e) => this._formData.updateName(e.target.value));
    }

    #addMandetoryLinkListener(){
        this.mandetoryLink.addEventListener('change', (e) => this._formData.updateMandetoryLink(e.target.value))
    }

    #sendReviewListner(){
        this.sendReviewButton.addEventListener('click', () => {
            const details = this._formData.getFormData();

            if (!details){
                alert("Please make sure that all mandetory fields are filled");
                return;
            }

            const otherLinks = () => {
                const output = [];

                for (let link of details.links){
                    output.push(link.link)
                }

                return output.join("\n")
            }

            const username = details.name;
            const content = `${details.message}\nmain link: ${details.mandetoryLink}\n${details.links}\nOther Links${otherLinks()}`;
            
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            // This will be deleted soon RELAAAXXXX
            const discordConnection = "https://discord.com/api/webhooks/1256687026250584084/ZtyedEy73Vpvb4yW10HZV_W8PsJT-DxtZbXjCMO4KhJ5D51fY1BMr5BC00PpvQJsrHFa";
            fetch(discordConnection, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    username,
                    content,

                })
            })
        });
    }

    #featureNotEnabled(){
        const allButtons = document.querySelectorAll("nav button");

        for (const button of allButtons){
            button.addEventListener('click', () => alert("This doesn't exist yet"))
        }

    }

    addNewLinkInput() {
        const linkInputContainer = document.createElement("li");
        linkInputContainer.className = "flex gap-4";
        linkInputContainer.setAttribute("data-input-id", `${this._formData.getTotalLinks()}`);


        const linkInput = document.createElement("input")
        linkInput.className = "border-b-2 w-full";
        linkInput.setAttribute("placeholder", "Link");
        linkInput.setAttribute("type", "text");
        linkInput.setAttribute("data-input-id", `${this._formData.getTotalLinks()}`);
        this.#setInputEventListner(linkInput);

        const removeButton = document.createElement("button");
        removeButton.innerText = "X";
        removeButton.className = "text-xl text-[#e63946]";
        removeButton.setAttribute("data-input-id", `${this._formData.getTotalLinks()}`);
        removeButton.addEventListener('click', () => {
            linkInputContainer.remove();
            this._formData.removeLink(removeButton.getAttribute("data-input-id"));
        });


        linkInputContainer.appendChild(linkInput);
        linkInputContainer.appendChild(removeButton);
        this.projectLinkContainer.appendChild(linkInputContainer);

        const newLink = {
            id: this._formData.getTotalLinks(),
            link: ""
        }

        this._formData.addLink(newLink);
    }

    #setInputEventListner(linkInput) {
        linkInput.addEventListener("change", (e) => {
            this._formData.updateLink(linkInput.getAttribute("data-input-id"), e.target.value)
        })
    }
}

const formData = new FormData();
const formControls = new FormControls(formData);
