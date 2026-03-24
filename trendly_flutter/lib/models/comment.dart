class Comment {
  final int id;
  final int userId;
  final String userName;
  final String articleUrl;
  final String content;
  final DateTime? createdAt;

  Comment({
    required this.id,
    required this.userId,
    required this.userName,
    required this.articleUrl,
    required this.content,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      userId: json['userId'] is int
          ? json['userId']
          : int.parse(json['userId'].toString()),
      userName: json['userName'] ?? '',
      articleUrl: json['articleUrl'] ?? '',
      content: json['content'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }
}
