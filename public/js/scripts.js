// Semester: 2023A
// Assessment: Assignment 2
// Author: 
//     To Bao Minh Hoang: s3978554
//     Le Viet Bao: s3979654
//     Huynh Ngoc Giang My: s3978986
//     Pho An Ninh: s3978162
// Acknowledgement: https://youtube.com/watch?v=991fdnSllcw&feature=share - live search bar, chatgpt, Mr Tom Huynh's RMIT Store 

'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navToggler = document.querySelector("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);


const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);


// function handleSearch(event) {
//   event.preventDefault();

//   const searchInput = document.getElementById('search-bar');
//   const searchQuery = searchInput.value.trim();

//   fetch(`/search?searchQuery=${encodeURIComponent(searchQuery)}`)
//     .then(response => response.json())
//     .then(data => {
//       // Handle the search results data
//       // Update the HTML content of the page with the search results
//     })
//     .catch(error => {
//       console.error('Error performing search:', error);
//     });
// }



  
  

/**
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeElemOnScroll);







// // /*Myie*/
// // /*auto calculate using price and quantity*/
// // function calculate() {
// //   var firstNumber = document.getElementById("price").innerHTML;
// //   var secondNumber = document.getElementById("quantity").innerHTML;
// //   var result = parseInt(firstNumber) + parseInt(secondNumber);
// //   document.getElementById("result").innerHTML = result;
// // }

// // window.onload = calculate;

// /*active close button on mobile display*/
// const bar = document.getElementById('bar');
// const close = document.getElementById('close');
// const nav = document.getElementById('navbar-items');

// if (bar){
//     bar.addEventListener('click', () =>{
//         nav.classList.add('active')
//     })
// }

// if (close){
//     close.addEventListener('click',() =>{
//         nav.classList.remove('active');
//     })
// }

// /*change price depends on the type of products*/
// function changePrice() {
//     var bookType = document.getElementById("book-type").value;
//     var bookPrice = document.getElementById("price");
//     if (bookType === "hardback") {
//       bookPrice.innerHTML = "$12.00";
//     } else {
//       bookPrice.innerHTML = "$5.00";
//     }
//   }
  
// /*view small picture in main picture upon click*/
// var bigImg = document.getElementById("main-img");
// var smallImg = document.getElementsByClassName("smalImg")

// // smallImg[0].onclick = function(){
// //     bigImg.src = smallImg[0].src;
// // }
// smallImg[1].onclick = function(){
//     bigImg.src = smallImg[1].src;
// }
// smallImg[2].onclick = function(){
//     bigImg.src = smallImg[2].src;
// }

// function rst(){
//     document.getElementById('form').reset();
// }