class Article {
  final String title;
  final String description;
  final String url;
  final String imageUrl;
  final String sourceName;
  final DateTime? publishedAt;

  Article({
    required this.title,
    required this.description,
    required this.url,
    required this.imageUrl,
    required this.sourceName,
    required this.publishedAt,
  });

  factory Article.fromJson(Map<String, dynamic> json) {
    final source = json['source'] ?? {};
    return Article(
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      url: json['url'] ?? '',
      imageUrl: json['urlToImage'] ?? '',
      sourceName: source['name'] ?? '',
      publishedAt: json['publishedAt'] != null
          ? DateTime.tryParse(json['publishedAt'])
          : null,
    );
  }
}
