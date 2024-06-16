export let assistantId = "asst_73h87uzHn59aUalZCquIjama"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
