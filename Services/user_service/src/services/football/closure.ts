// lets nail this

function dale(x?: number): void {
  if (x) {
    let hi = 'hi';
    var bye = 'bye';
  }
  // console.log(hi); // can't find name 'hi'
  console.log(bye);
}

function add(n: number) {
  let number: number = n; // because its declared in the outer scope, i can access even using 'let'

  return {
    addCount() {
      // this syntax is because its a method to an object -- this way I can return multiple functions
      number += 1;
      console.log(number);
    },
  };
}

/* right I get it, because a function is being returned,
we are assigning the returning function to the variable 'closure'
so, when we 'invoke closure' we are invoking that nested return function.
and it actually has access to that internal variable while the app is running,
so ONLY that returned function can access that scoped in variable.

Because of how javascript works, when we assign a function to a variable, we assign whatever the return value is.
*/

var closure = add(1);
closure.addCount();
closure.addCount();

const daleddd = 'abc';
