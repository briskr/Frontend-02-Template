class Animal {
  constructor(name) {
    this.name = name ? name : "an animal";
  }
  toString() {
    return this.name;
  }
}

class HurtableAnimal extends Animal {
  constructor(name) {
    super(name);
    this.hp = 10;
  }
  hurt() {
    if (this.hp > 0) this.hp--;
    console.log(this.name + " got hurt, HP: " + this.hp);
  }
}

class BitingAnimal extends Animal {
  bite(target) {
    console.log(this + " bites " + target);
    if (target.hurt) {
      target.hurt();
    }
  }
}

class Dog extends BitingAnimal {
  constructor() {
    super("a dog");
  }
}

class Human extends HurtableAnimal {
  constructor() {
    super("a human being");
  }
}

const d = new Dog();
const h = new Human();
d.bite(h);
d.bite(h);
