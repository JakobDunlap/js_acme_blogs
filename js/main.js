function createElemWithText(elementName = 'p', textContent = '', className) {
    const newElement = document.createElement(elementName);
    newElement.textContent = textContent;
    if(className){
    newElement.classList.add(className);
    };
    return newElement;
};

function createSelectOptions(usersJSON) {
    if(!usersJSON) {
        return undefined;
    };
    const optionsElements = [];
    for(const user of usersJSON){
        const optionElement = document.createElement("option");
        optionElement.value = user.id;
        optionElement.textContent = user.name;
        optionsElements.push(optionElement);
    };

    return optionsElements;
};

function toggleCommentSection(postId) {
    if(!postId) {
        return undefined;
    };
    const sectionElement = document.querySelector(`section[data-post-id= '${postId}']`);
    if(sectionElement) {
        sectionElement.classList.toggle('hide');
        return sectionElement;
    }else{
        return null;
    };
};

function toggleCommentButton(postId) {
    if(!postId) {
        return undefined;
    };
    const buttonElement = document.querySelector(`button[data-post-id= '${postId}']`);
    if(buttonElement) {
        let buttonText = buttonElement.textContent;
        buttonText === "Show Comments" 
            ? (buttonElement.textContent = "Hide Comments")
            : (buttonElement.textContent = "Show Comments");
        return buttonElement;
    }else{
        return null;
    };
};

function deleteChildElements (parentElement) {
    if(parentElement instanceof Element) {
        let childElement = parentElement.lastElementChild;
    while(childElement) {
        parentElement.removeChild(childElement);
        childElement = parentElement.lastElementChild;
    };
    return parentElement;
    }else{
        return undefined;
    };
};

function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    if(buttons?.length) {
        for(const button of buttons) {
        if(button.hasAttribute("data-post-id")) {
            let buttonPostId = button.dataset.postId;
            button.addEventListener("click", function(event) {toggleComments(event, buttonPostId)}, false);
        }else{
          continue;
        };
    };
    return buttons;
    }else{
    return buttons;
    };
};

function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    for(const button of buttons) {
        let hasAttribute = button.hasAttribute("data-post-id");
        if(button.hasAttribute("data-post-id")) {
            let buttonPostId = button.dataset.postId;
            button.removeEventListener("click", function(event) {toggleComments(event, buttonPostId)}, false);
        }else{
            continue;
        };
    };
    return buttons;
};

function createComments(commentsJSON) {
    if(!commentsJSON) {
        return undefined;
    };
    const fragmentElem = document.createDocumentFragment();
    for(const comment of commentsJSON) {
        let articleElem = document.createElement("article");
        const h3Elem = createElemWithText("h3", comment.name);
        const pBodyElem = createElemWithText("p", comment.body);
        const pEmailElem = createElemWithText("p", `From: ${comment.email}`);
        articleElem.append(h3Elem);
        articleElem.append(pBodyElem);
        articleElem.append(pEmailElem);
        fragmentElem.append(articleElem);
    };
    return fragmentElem;
};

function populateSelectMenu(usersJSON) {
    if(!usersJSON) {
        return undefined;
    };
    const selectMenu = document.querySelector("#selectMenu");
    const optionsElem = createSelectOptions(usersJSON);
    for (let i=0; i<optionsElem.length; i++) {
        selectMenu.append(optionsElem[i]);
    };
    return selectMenu;
};

async function getUsers() {
    try {
        const usersData = await fetch("https://jsonplaceholder.typicode.com/users");
        if(!usersData.ok) {
            throw new Error("Error: User data not recieved");
        };
        return await usersData.json();
    }catch(err){
        console.error(err);
    };
};

async function getUserPosts(userId) {
    if(!userId) {
        return undefined;
    };
    try {
        const postData= await fetch("https://jsonplaceholder.typicode.com/posts?userId="+userId);
        if(!postData.ok) {
            throw new Error("Error: Post data not recieved");
        };
        return await postData.json();
    }catch(err){
        console.error(err);
    };
};

async function getUser(userId) {
    if(!userId) {
        return undefined;
    };
    try {
        const user= await fetch("https://jsonplaceholder.typicode.com/users/"+userId);
        if(!user.ok) {
            throw new Error("Error: User not recieved");
        };
        return await user.json();
    }catch(err){
        console.error(err);
    };
};

async function getPostComments(postId) {
    if(!postId) {
        return undefined;
    };
    try {
        const comments= await fetch("https://jsonplaceholder.typicode.com/comments?postId="+postId);
        if(!comments.ok) {
            throw new Error("Error: Posts not recieved");
        };
        return await comments.json();
    }catch(err){
        console.error(err);
    };
};

async function displayComments(postId) {
    if(!postId) {
        return undefined;
    };
    const commentSection = document.createElement("section");
    commentSection.dataset.postId = postId;
    commentSection.classList.add('comments');
    commentSection.classList.add('hide');
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    commentSection.append(fragment);
    return commentSection;
};

async function createPosts(postsJSON) {
    if(!postsJSON) {
        return undefined;
    };
    const fragment = document.createDocumentFragment();
    for(const post of postsJSON) {
        let articleElem = document.createElement("article");
        const h2Elem = createElemWithText("h2", post.title);
        const bodyElem = createElemWithText("p", post.body);
        const IdElem = createElemWithText("p", `Post ID: ${post.id}`);
        let author = await getUser(post.userId);
        const authorPara = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        const tagLine = createElemWithText("p", `${author.company.catchPhrase}`);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        articleElem.append(h2Elem);
        articleElem.append(bodyElem);
        articleElem.append(IdElem);
        articleElem.append(authorPara);
        articleElem.append(tagLine);
        articleElem.append(button);
        let section = await displayComments(post.id);
        articleElem.append(section);
        fragment.append(articleElem);
    };
    return fragment;
};

async function displayPosts(posts) {
    const mainElem = document.querySelector("main");
    let element = (posts) 
        ? await createPosts(posts) 
        : createElemWithText("p", "Select an Employee to display their posts.", "default-text");
    mainElem.append(element);
    return element;
};

function toggleComments(event, postId) {
    if(!(event && postId)) {
        return undefined;
    };
    let buttonArray = []
    event.target.listener = true;
    buttonArray.push(toggleCommentSection(postId));
    buttonArray.push(toggleCommentButton(postId));
    return buttonArray;
};

async function refreshPosts(postsJSON) {
    if(!postsJSON) {
        return undefined;
    };
    let mainElem = document.querySelector("main");
    let removed = removeButtonListeners();
    mainElem = deleteChildElements(mainElem);
    let posts = await displayPosts(postsJSON)
    let added = addButtonListeners();
    return [removed, mainElem, posts, added];
};

async function selectMenuChangeEventHandler(event) {
    if(event?.type != "change") {
        return;
    };
    let userId = event.target?.value;
    if (userId === "Employees" || userId === undefined) {
        userId = 1;
    };
    let selectMenu = event.target;
    if(selectMenu != undefined) {
        selectMenu.disabled = true;
    };
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    if(selectMenu != undefined) {
        selectMenu.disabled = false;
    };
    return [userId, posts, refreshPostsArray];
};

async function initPage() {
    let userJSON = await getUsers();
    let selectElem = populateSelectMenu(userJSON);
    return [userJSON, selectElem];
};

function initApp() {
    initPage();
    const selectMenu = document.querySelector("#selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler, false);
};

document.addEventListener("DOMContentLoaded", (event) => {
    initApp();
});