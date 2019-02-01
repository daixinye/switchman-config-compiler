function tokenizer(input) {
  let current = 0;
  const tokens = [];

  const WHITESPACE = /\s/;
  const NUMBER = /[0-9]/;
  const LETTERS = /[a-z]/i;

  while (current < input.length) {
    let char = input[current];

    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "("
      });
      current++;
      continue;
    }

    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")"
      });
      current++;
      continue;
    }

    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    if (NUMBER.test(char)) {
      let value = "";
      while (NUMBER.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: "number",
        value
      });

      continue;
    }

    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: "name",
        value
      });

      continue;
    }
  }

  return tokens;
}

if (require.main === module) {
  const INPUT = "(add 2 (subtract 4 2))";
  const tokens = tokenizer(INPUT);
  console.dir(tokens);
}
