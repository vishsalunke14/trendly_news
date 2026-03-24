import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/api_config.dart';
import '../models/like_toggle_result.dart';
import '../models/user.dart';
import '../models/article.dart';
import '../models/bookmark.dart';
import '../models/comment.dart';
import '../models/admin_analytics.dart';
import '../models/admin_comment.dart';



class ApiClient {
  ApiClient._();

  static final ApiClient instance = ApiClient._();

  Future<Map<String, dynamic>> _postJson(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri = Uri.parse('$backendBaseUrl$path');

    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {};
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      String message = 'Request failed (${response.statusCode})';
      if (response.body.isNotEmpty) {
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map && decoded['message'] is String) {
            message = decoded['message'];
          }
        } catch (_) {}
      }
      throw Exception(message);
    }
  }

  Future<List<dynamic>> _getList(String path) async {
    final uri = Uri.parse('$backendBaseUrl$path');

    final response = await http.get(uri);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return const [];
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      throw Exception('Expected a list response');
    } else {
      String message = 'Request failed (${response.statusCode})';
      if (response.body.isNotEmpty) {
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map && decoded['message'] is String) {
            message = decoded['message'];
          }
        } catch (_) {}
      }
      throw Exception(message);
    }
  }

  Future<void> _delete(String path) async {
    final uri = Uri.parse('$backendBaseUrl$path');

    final response = await http.delete(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      String message = 'Delete failed (${response.statusCode})';
      if (response.body.isNotEmpty) {
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map && decoded['message'] is String) {
            message = decoded['message'];
          }
        } catch (_) {}
      }
      throw Exception(message);
    }
  }

  /// --- AUTH ---

  /// Call your Spring Boot: POST /api/auth/login
  Future<AppUser> login(String email, String password) async {
    final json = await _postJson('/api/auth/login', {
      'email': email,
      'password': password,
    });

    return AppUser.fromJson(json);
  }

  /// --- BOOKMARKS ---

  /// POST /api/bookmarks
  Future<void> addBookmark({
    required int userId,
    required Article article,
  }) async {
    await _postJson('/api/bookmarks', {
      'userId': userId,
      'articleUrl': article.url,
      'title': article.title,
      'sourceName': article.sourceName,
      'imageUrl': article.imageUrl,
    });
  }

  /// GET /api/bookmarks/user/{userId}
  Future<List<Bookmark>> fetchBookmarksForUser(int userId) async {
    final list = await _getList('/api/bookmarks/user/$userId');

    return list
        .map((item) => Bookmark.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  /// DELETE /api/bookmarks/{id}?userId=...
  Future<void> deleteBookmark(int bookmarkId, int userId) async {
    await _delete('/api/bookmarks/$bookmarkId?userId=$userId');
  }


    /// --- LIKES ---

  /// POST /api/likes/toggle
  Future<LikeToggleResult> toggleLike({
    required int userId,
    required String articleUrl,
  }) async {
    final json = await _postJson('/api/likes/toggle', {
      'userId': userId,
      'articleUrl': articleUrl,
    });

    final liked = json['liked'] == true;
    final likeCountRaw = json['likeCount'] ?? 0;

    final likeCount = likeCountRaw is int
        ? likeCountRaw
        : int.tryParse(likeCountRaw.toString()) ?? 0;

    return LikeToggleResult(
      liked: liked,
      likeCount: likeCount,
    );
  }

    /// --- COMMENTS ---

  /// GET /api/comments?articleUrl=...
  Future<List<Comment>> fetchCommentsForArticle(String articleUrl) async {
    final encoded = Uri.encodeComponent(articleUrl);
    final list = await _getList('/api/comments?articleUrl=$encoded');

    return list
        .map((item) => Comment.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  /// POST /api/comments
  Future<Comment> addComment({
    required int userId,
    required String userName,
    required String articleUrl,
    required String content,
  }) async {
    final json = await _postJson('/api/comments', {
      'userId': userId,
      'userName': userName,
      'articleUrl': articleUrl,
      'content': content,
    });

    return Comment.fromJson(json);
  }

  /// DELETE /api/comments/{commentId}?userId=...
  Future<void> deleteComment(int commentId, int userId) async {
    await _delete('/api/comments/$commentId?userId=$userId');
  }


  Future<Map<String, dynamic>> _getJson(String path) async {
    final uri = Uri.parse('$backendBaseUrl$path');

    final response = await http.get(uri);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {};
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }
      throw Exception('Expected an object response');
    } else {
      String message = 'Request failed (${response.statusCode})';
      if (response.body.isNotEmpty) {
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map && decoded['message'] is String) {
            message = decoded['message'];
          }
        } catch (_) {}
      }
      throw Exception(message);
    }
  }

  Future<Map<String, dynamic>> _putJson(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri = Uri.parse('$backendBaseUrl$path');

    final response = await http.put(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {};
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }
      throw Exception('Expected an object response');
    } else {
      String message = 'Request failed (${response.statusCode})';
      if (response.body.isNotEmpty) {
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map && decoded['message'] is String) {
            message = decoded['message'];
          }
        } catch (_) {}
      }
      throw Exception(message);
    }
  }


  /// --- USER / PROFILE ---

  /// GET /api/users/{id}
  Future<AppUser> fetchUserById(int id) async {
    final json = await _getJson('/api/users/$id');
    return AppUser.fromJson(json);
  }

  /// PUT /api/users/{id}  -> update name
  Future<AppUser> updateProfile({
    required int userId,
    required String name,
  }) async {
    final json = await _putJson('/api/users/$userId', {
      'name': name,
    });

    return AppUser.fromJson(json);
  }

  /// PUT /api/users/{id}/password
  Future<void> changePassword({
    required int userId,
    required String currentPassword,
    required String newPassword,
  }) async {
    await _putJson('/api/users/$userId/password', {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
  }

  /// --- ADMIN ---

  /// GET /api/admin/analytics/summary
  Future<AdminAnalytics> fetchAdminAnalytics() async {
    final json = await _getJson('/api/admin/analytics/summary');
    return AdminAnalytics.fromJson(json);
  }

  /// --- ADMIN COMMENTS ---

  /// GET /api/admin/comments
  Future<List<AdminComment>> fetchAdminComments() async {
    final list = await _getList('/api/admin/comments');

    return list
        .map((item) => AdminComment.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  /// DELETE /api/admin/comments/{id}?adminId=...
  Future<void> deleteAdminComment({
    required int commentId,
    required int adminId,
  }) async {
    await _delete('/api/admin/comments/$commentId?adminId=$adminId');
  }


}
