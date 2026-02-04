#!/usr/bin/env python3
"""
Script to close useless automated roadmap PRs using GitHub API.

This script closes PRs #97-124 that were automatically created by
the autonomous-roadmap-agent workflow before scheduled triggers were removed.
"""

import os
import sys
import json
import time
from urllib.request import Request, urlopen
from urllib.error import HTTPError

def close_useless_prs():
    """Close all useless automated roadmap PRs."""
    
    # Get GitHub token from environment
    github_token = os.environ.get('GITHUB_TOKEN')
    if not github_token:
        print("❌ Error: GITHUB_TOKEN environment variable is not set")
        sys.exit(1)
    
    repo = "derrybirkett/frctls"
    base_url = f"https://api.github.com/repos/{repo}"
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    print("🧹 Starting cleanup of useless automated roadmap PRs...")
    print()
    
    closed_count = 0
    skipped_count = 0
    
    # PRs 97-124 (28 PRs total) are the automated roadmap PRs that need to be closed
    for pr_number in range(97, 125):
        print(f"Checking PR #{pr_number}...")
        
        try:
            # Get PR details
            req = Request(f"{base_url}/pulls/{pr_number}", headers=headers)
            with urlopen(req) as response:
                pr_data = json.loads(response.read().decode())
            
            pr_state = pr_data.get('state', 'not_found')
            pr_title = pr_data.get('title', '')
            
            if pr_state == 'open':
                # Only close PRs with the automated roadmap title
                if '[Auto] Implement roadmap task' in pr_title:
                    print(f"  Found open automated PR #{pr_number}: {pr_title}")
                    
                    # Add a comment explaining why it's being closed
                    comment_data = json.dumps({
                        "body": "Closing this automated PR as it was created by a scheduled workflow that has been disabled. These PRs were not properly reviewed or completed."
                    }).encode()
                    
                    req = Request(
                        f"{base_url}/issues/{pr_number}/comments",
                        data=comment_data,
                        headers=headers,
                        method='POST'
                    )
                    
                    try:
                        with urlopen(req) as response:
                            pass  # Comment added successfully
                    except HTTPError as e:
                        print(f"  ⚠️  Warning: Failed to add comment: {e}")
                    
                    # Close the PR
                    close_data = json.dumps({"state": "closed"}).encode()
                    req = Request(
                        f"{base_url}/pulls/{pr_number}",
                        data=close_data,
                        headers=headers,
                        method='PATCH'
                    )
                    
                    with urlopen(req) as response:
                        result = json.loads(response.read().decode())
                        if result.get('state') == 'closed':
                            print(f"  ✅ Closed PR #{pr_number}")
                            closed_count += 1
                        else:
                            print(f"  ❌ Failed to close PR #{pr_number}")
                else:
                    print(f"  Skipping PR #{pr_number} (not an automated roadmap PR): {pr_title}")
                    skipped_count += 1
            elif pr_state == 'closed':
                print(f"  Skipping PR #{pr_number} (already closed)")
                skipped_count += 1
            else:
                print(f"  Skipping PR #{pr_number} (not found)")
                skipped_count += 1
                
        except HTTPError as e:
            if e.code == 404:
                print(f"  Skipping PR #{pr_number} (not found)")
                skipped_count += 1
            else:
                print(f"  ❌ Error accessing PR #{pr_number}: {e}")
                skipped_count += 1
        except Exception as e:
            print(f"  ❌ Error processing PR #{pr_number}: {e}")
            skipped_count += 1
        
        print()
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    print("✅ Cleanup complete!")
    print(f"   Closed: {closed_count} PRs")
    print(f"   Skipped: {skipped_count} PRs")

if __name__ == '__main__':
    close_useless_prs()
