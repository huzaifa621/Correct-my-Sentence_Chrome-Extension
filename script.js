import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
   new Configuration({
      // Here, you need to enter your OpenAI API key
      // you can generate it from here -> https://platform.openai.com/account/api-keys
      // apiKey: OPENAI_API_KEY,
   })
);

let user_input = document.getElementById("user_input");
let output_box = document.getElementById("output_box");
let generate = document.getElementById("generate");
let copy_btn = document.getElementById("copy_btn");
let clear_user_input = document.getElementById("clear_user_input");

generate.addEventListener("click", (e) => {
   // output_box.value = user_input.value;
   generate.disabled = true;
   let count = 1;
   let id = setInterval(() => {
      let bag = "";
      if (count > 3) {
         count = 1;
      }
      for (let i = 1; i <= count; i++) {
         bag += ".";
      }
      generate.innerText = "Loading" + bag;
      count += 1;
   }, 500);

   openai
      .createChatCompletion({
         model: "gpt-3.5-turbo",
         messages: [
            {
               role: "user",
               content: `Correct the grammar of below message, do not change its tone:
            ${user_input.value}`,
            },
         ],
      })
      .then((res) => {
         output_box.value = res.data.choices[0].message.content;
         clearInterval(id);
         generate.disabled = false;
         generate.innerText = "Generate";
         console.log(res);
      })
      .catch((err) => {
         clearInterval(id);
         generate.disabled = false;
         generate.innerText = "Generate";
         console.log("ERROR HAPPENED!");
         console.log(err);
      });
});

copy_btn.addEventListener("click", () => {
   navigator.clipboard.writeText(output_box.value);
   setTimeout(() => {
      copy_btn.innerText = "Copy";
   }, 1000);
   copy_btn.innerText = "Copied!";
});

clear_user_input.addEventListener("click", () => {
   user_input.value = "";
   output_box.value = "";
});
