class AdminComment {
  final int id;
  final int userId;
  final String userName;
  final String articleUrl;
  final String content;
  final DateTime? createdAt;

  AdminComment({
    required this.id,
    required this.userId,
    required this.userName,
    required this.articleUrl,
    required this.content,
    required this.createdAt,
  });

  factory AdminComment.fromJson(Map<String, dynamic> json) {
    int _toInt(dynamic v) {
      if (v == null) return 0;
      if (v is int) return v;
      return int.tryParse(v.toString()) ?? 0;
    }

    return AdminComment(
      id: _toInt(json['id']),
      userId: _toInt(json['userId']),
      userName: json['userName'] ?? '',
      articleUrl: json['articleUrl'] ?? '',
      content: json['content'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }
}
