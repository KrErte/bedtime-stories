class Child {
  final String id;
  final String name;
  final int age;
  final String? gender;
  final List<String>? interests;
  final String? favoriteAnimal;

  Child({required this.id, required this.name, required this.age, this.gender, this.interests, this.favoriteAnimal});

  factory Child.fromJson(Map<String, dynamic> json) => Child(
    id: json['id'],
    name: json['name'],
    age: json['age'],
    gender: json['gender'],
    interests: json['interests'] != null ? List<String>.from(json['interests']) : null,
    favoriteAnimal: json['favoriteAnimal'],
  );
}
