class Bookmark {
  final int id;
  final int userId;
  final String articleUrl;
  final String title;
  final String sourceName;
  final String imageUrl;

  Bookmark({
    required this.id,
    required this.userId,
    required this.articleUrl,
    required this.title,
    required this.sourceName,
    required this.imageUrl,
  });

  factory Bookmark.fromJson(Map<String, dynamic> json) {
    return Bookmark(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      userId: json['userId'] is int
          ? json['userId']
          : int.parse(json['userId'].toString()),
      articleUrl: json['articleUrl'] ?? '',
      title: json['title'] ?? '',
      sourceName: json['sourceName'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
    );
  }
}
