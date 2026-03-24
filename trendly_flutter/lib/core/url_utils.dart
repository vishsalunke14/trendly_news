import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

Future<void> openUrlInBrowser(BuildContext context, String url) async {
  if (url.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('No URL available for this article.')),
    );
    return;
  }

  final uri = Uri.tryParse(url);
  if (uri == null) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Invalid URL: $url')),
    );
    return;
  }

  if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Could not open the article.')),
    );
  }
}
