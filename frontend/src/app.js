class FormData
{
    constructor(){
        this._reviewType = 1;
        this._message = undefined;
        this._mandetoryLink = undefined;
        this._links = [];        
    }

    getFormData(){    
        return this.isValid() ?  {
            reviewType: this._reviewType,
            message: this._message,
            mandetoryLink: this._mandetoryLink,
            links: this._links
        } : undefined;
    }

    isValid(){
        return this._reviewType && this._mandetoryLink && this._message;
    }

    updateMessage(message){
        message = this.#cleanText;
        this._message = message;
    }    

    #cleanText(text){
        return text
    }

    updateMandetoryLink(link){
        link = this.#cleanLink;
        this._mandetoryLink = link;
    }

    addLink(link){
        link.link = this.#cleanLink(link.link);

        this._links.push(link);
    }

    #cleanLink(link){
        if (link === "")
            return undefined;


        const allowedPattern = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
        
        if (!allowedPattern.test(link)) {
          throw new Error("Invalid characters in the link");
        }                
        return link
    }

    removeLink(linkId){
        this._links = this._links.filter(link => link.id !== linkId);
    }

    getTotalLinks(){
        return this._links.length;
    }

    updateLink(linkId, link){
        link = this.#cleanLink(link);
        this._links = this._links.map((l) => {
            if (l.id === linkId) {
                l.link = link;
            }
            return l;
        })    
    }
}

class FormControls
{
    feedbackType = document.getElementsByClassName("feedback-type");
    feedbackMessage = document.getElementById("feedback-message");
    mandetoryLink = document.getElementById("mandetory-link");
    projectLinkContainer = document.getElementById("project-links");
    addLinkButton = document.getElementById("add-link-button");

    /**
     * 
     * @param {FormData} formData 
     */
    constructor(formData){
        this._formData = formData;
        this.addButtonEventListeners();
    }

    addButtonEventListeners(){
        this.addLinkButton.addEventListener('click', () => {            
            this.addNewLinkInput();
        })
    }

    updateReviewType(type){
        this.feedbackType.forEach(element => {
            element.classList.remove("selected");
            feedbackType = element.getAttribute("data-feedback-type");

            if (this.feedbackType == type)
                element.classList.add("selected");
            
        });
    }    

    addNewLinkInput(){
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
        removeButton.innerText  = "X";
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

    #setInputEventListner(linkInput){
        linkInput.addEventListener("change", (e) => {            
            this._formData.updateLink(linkInput.getAttribute("data-input-id"), e.target.value)
        })
    }
}

const formData = new FormData();
const formControls = new FormControls(formData);
