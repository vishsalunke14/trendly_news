class AppUser {
  final int id;
  final String name;
  final String email;
  final String role;

  AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? '',
    );
  }
}
