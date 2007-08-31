require RecurseWork;

$Priorities{'index.html'} = '1.0';

sub GetPriority()
{
	my $FileName = shift @_;
	my $NbSlash;
	
	if ( defined $Priorities{$FileName} )
	{
		return $Priorities{$FileName};
	}
	
	$NbSlash = 0;
	# compte combien de / on a
	while( $FileName =~ /(.*)\/(.*)/ )
	{
		$FileName = $1 . $2;
		$NbSlash++;
	}
	
	if ( $NbSlash > 8 )
	{
		$NbSlash = 1;
	}
	else
	{
		$NbSlash = 9 - $NbSlash;
	}
	
	return '0.' . $NbSlash . '000';
}

sub WorkOnFile()
{
 	my $FileName = shift @_;
 	my $UserData = shift @_;

	if ( $FileName =~ /\.html?$/ )
	{
		$FileName =~ s/^$UserData//;
		print "<url>\n  <loc>http://omiscid.gforge.inria.fr/$FileName</loc>\n  <priority>";
		print &GetPriority($FileName);
		print "</priority>\n</url>\n";
	}
}

if ( ! defined $ARGV[0] || ! -e $ARGV[0] || ! -d $ARGV[0] )
{
	die "Bad parameter\n";
}

$Rep = $ARGV[0];

if ( $Rep =~ /[^\/]$/ )
{
	$Rep .= '/';
}

print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset
  xmlns=\"http://www.google.com/schemas/sitemap/0.84\"
  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"
  xsi:schemaLocation=\"http://www.google.com/schemas/sitemap/0.84
                      http://www.google.com/schemas/sitemap/0.84/sitemap.xsd\">
";

&RecurseWork::RecurseWork($Rep,$Rep);

print "\n</urlset>\n";