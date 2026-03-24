class AdminArticleCount {
  final String articleUrl;
  final int count;

  AdminArticleCount({
    required this.articleUrl,
    required this.count,
  });

  factory AdminArticleCount.fromJson(Map<String, dynamic> json) {
    int _toInt(dynamic v) {
      if (v == null) return 0;
      if (v is int) return v;
      return int.tryParse(v.toString()) ?? 0;
    }

    return AdminArticleCount(
      articleUrl: json['articleUrl'] ?? '',
      count: _toInt(json['count']),
    );
  }
}

class AdminAnalytics {
  final int totalUsers;
  final int totalAdmins;
  final int totalNormalUsers;
  final int totalLikes;
  final int totalComments;
  final int totalBookmarks;
  final List<AdminArticleCount> topLikedArticles;
  final List<AdminArticleCount> topCommentedArticles;

  AdminAnalytics({
    required this.totalUsers,
    required this.totalAdmins,
    required this.totalNormalUsers,
    required this.totalLikes,
    required this.totalComments,
    required this.totalBookmarks,
    required this.topLikedArticles,
    required this.topCommentedArticles,
  });

  factory AdminAnalytics.fromJson(Map<String, dynamic> json) {
    int _toInt(dynamic v) {
      if (v == null) return 0;
      if (v is int) return v;
      return int.tryParse(v.toString()) ?? 0;
    }

    final topLiked = (json['topLikedArticles'] as List<dynamic>? ?? [])
        .map((e) => AdminArticleCount.fromJson(e as Map<String, dynamic>))
        .toList();

    final topCommented = (json['topCommentedArticles'] as List<dynamic>? ?? [])
        .map((e) => AdminArticleCount.fromJson(e as Map<String, dynamic>))
        .toList();

    return AdminAnalytics(
      totalUsers: _toInt(json['totalUsers']),
      totalAdmins: _toInt(json['totalAdmins']),
      totalNormalUsers: _toInt(json['totalNormalUsers']),
      totalLikes: _toInt(json['totalLikes']),
      totalComments: _toInt(json['totalComments']),
      totalBookmarks: _toInt(json['totalBookmarks']),
      topLikedArticles: topLiked,
      topCommentedArticles: topCommented,
    );
  }
}
